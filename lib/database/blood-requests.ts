import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type BloodRequest = Database["public"]["Tables"]["blood_requests"]["Row"]
type BloodRequestInsert = Database["public"]["Tables"]["blood_requests"]["Insert"]
type BloodRequestUpdate = Database["public"]["Tables"]["blood_requests"]["Update"]

export async function createBloodRequest(requestData: BloodRequestInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blood_requests")
    .insert(requestData)
    .select(`
      *,
      hospitals!blood_requests_hospital_id_fkey(name, location, phone)
    `)
    .single()

  if (error) {
    console.error("Error creating blood request:", error)
    throw new Error("Failed to create blood request")
  }

  return data
}

export async function getBloodRequestsByHospital(hospitalId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blood_requests")
    .select(`
      *,
      donor_responses(
        id,
        response,
        responded_at,
        donors!donor_responses_donor_id_fkey(name, phone)
      )
    `)
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blood requests:", error)
    throw new Error("Failed to fetch blood requests")
  }

  return data
}

export async function getBloodRequestById(requestId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blood_requests")
    .select(`
      *,
      hospitals!blood_requests_hospital_id_fkey(name, location, phone)
    `)
    .eq("id", requestId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching blood request:", error)
    throw new Error("Failed to fetch blood request")
  }

  return data
}

export async function updateBloodRequestStatus(requestId: string, status: "active" | "fulfilled" | "cancelled") {
  const supabase = await createClient()

  const { data, error } = await supabase.from("blood_requests").update({ status }).eq("id", requestId).select().single()

  if (error) {
    console.error("Error updating blood request status:", error)
    throw new Error("Failed to update blood request status")
  }

  return data
}

export async function getActiveBloodRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blood_requests")
    .select(`
      *,
      hospitals!blood_requests_hospital_id_fkey(name, location)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching active blood requests:", error)
    throw new Error("Failed to fetch active blood requests")
  }

  return data
}
