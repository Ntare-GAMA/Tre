import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type Hospital = Database["public"]["Tables"]["hospitals"]["Row"]
type HospitalInsert = Database["public"]["Tables"]["hospitals"]["Insert"]
type HospitalUpdate = Database["public"]["Tables"]["hospitals"]["Update"]

export async function createHospital(hospitalData: HospitalInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hospitals").insert(hospitalData).select().single()

  if (error) {
    console.error("Error creating hospital:", error)
    throw new Error("Failed to create hospital")
  }

  return data
}

export async function getHospitalsByStatus(status: "pending" | "approved" | "rejected") {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("hospitals")
    .select(`
      *,
      users!hospitals_user_id_fkey(email)
    `)
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching hospitals:", error)
    throw new Error("Failed to fetch hospitals")
  }

  return data
}

export async function updateHospitalStatus(
  hospitalId: string,
  status: "approved" | "rejected",
  adminId: string,
  rejectionReason?: string,
) {
  const supabase = await createClient()

  const updateData: HospitalUpdate = {
    status,
    approved_by: adminId,
    approved_at: new Date().toISOString(),
  }

  if (status === "rejected" && rejectionReason) {
    updateData.rejection_reason = rejectionReason
  }

  const { data, error } = await supabase.from("hospitals").update(updateData).eq("id", hospitalId).select().single()

  if (error) {
    console.error("Error updating hospital status:", error)
    throw new Error("Failed to update hospital status")
  }

  return data
}

export async function getHospitalByUserId(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("hospitals").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found"
    console.error("Error fetching hospital:", error)
    throw new Error("Failed to fetch hospital")
  }

  return data
}

export async function getDashboardStats() {
  const supabase = await createClient()

  // Get hospital counts
  const { data: hospitals, error: hospitalsError } = await supabase.from("hospitals").select("status")

  if (hospitalsError) {
    console.error("Error fetching hospital stats:", hospitalsError)
    throw new Error("Failed to fetch hospital stats")
  }

  // Get donor count
  const { count: donorCount, error: donorsError } = await supabase
    .from("donors")
    .select("*", { count: "exact", head: true })

  if (donorsError) {
    console.error("Error fetching donor count:", donorsError)
    throw new Error("Failed to fetch donor count")
  }

  // Get active requests count
  const { count: activeRequestsCount, error: requestsError } = await supabase
    .from("blood_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  if (requestsError) {
    console.error("Error fetching active requests count:", requestsError)
    throw new Error("Failed to fetch active requests count")
  }

  return {
    totalHospitals: hospitals.length,
    pendingApprovals: hospitals.filter((h) => h.status === "pending").length,
    totalDonors: donorCount || 0,
    activeRequests: activeRequestsCount || 0,
  }
}
