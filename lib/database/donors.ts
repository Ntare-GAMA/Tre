import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type Donor = Database["public"]["Tables"]["donors"]["Row"]
type DonorInsert = Database["public"]["Tables"]["donors"]["Insert"]
type DonorUpdate = Database["public"]["Tables"]["donors"]["Update"]

export async function createDonor(donorData: DonorInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("donors").insert(donorData).select().single()

  if (error) {
    console.error("Error creating donor:", error)
    throw new Error("Failed to create donor")
  }

  return data
}

export async function getDonorsByBloodType(bloodType: string, isAvailable = true) {
  const supabase = await createClient()

  let query = supabase.from("donors").select("*").eq("blood_type", bloodType)

  if (isAvailable) {
    query = query.eq("is_available", true)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching donors:", error)
    throw new Error("Failed to fetch donors")
  }

  return data
}

export async function getAllAvailableDonors() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("donors")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching donors:", error)
    throw new Error("Failed to fetch donors")
  }

  return data
}

export async function getDonorByPhone(phone: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("donors").select("*").eq("phone", phone).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching donor:", error)
    throw new Error("Failed to fetch donor")
  }

  return data
}

export async function updateDonorAvailability(donorId: string, isAvailable: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("donors")
    .update({
      is_available: isAvailable,
      last_donation_date: isAvailable ? null : new Date().toISOString().split("T")[0],
    })
    .eq("id", donorId)
    .select()
    .single()

  if (error) {
    console.error("Error updating donor availability:", error)
    throw new Error("Failed to update donor availability")
  }

  return data
}

// Function to find nearby donors using PostGIS (if available) or simple filtering
export async function findNearbyDonors(latitude: number, longitude: number, bloodType: string, radiusKm = 10) {
  const supabase = await createClient()

  // For now, we'll get all available donors of the blood type
  // In production, you'd use PostGIS for proper distance calculations
  const { data, error } = await supabase.from("donors").select("*").eq("blood_type", bloodType).eq("is_available", true)

  if (error) {
    console.error("Error fetching nearby donors:", error)
    throw new Error("Failed to fetch nearby donors")
  }

  // Simple distance calculation (in production, use PostGIS)
  const donorsWithDistance = data
    .map((donor: { latitude: number; longitude: number }) => {
      let distance = 0
      if (donor.latitude && donor.longitude) {
        distance = calculateDistance(latitude, longitude, donor.latitude, donor.longitude)
      }
      return { ...donor, distance }
    })
    .filter((donor: { distance: number }) => donor.distance <= radiusKm)

  return donorsWithDistance
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}
