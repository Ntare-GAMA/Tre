"use server"

import { addDonor } from "@/lib/mock-database"

export async function registerDonor(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const whatsapp = formData.get("whatsapp") as string
    const bloodType = formData.get("bloodType") as string
    const location = formData.get("location") as string

    console.log("🩸 Donor registration data:", {
      name,
      phone,
      whatsapp: whatsapp || "Not provided",
      bloodType,
      location,
    })

    // Validate required fields
    if (!name || !phone || !bloodType || !location) {
      return { success: false, error: "All required fields must be filled" }
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return { success: false, error: "Invalid phone number format" }
    }

    // Validate blood type
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    if (!validBloodTypes.includes(bloodType)) {
      return { success: false, error: "Invalid blood type" }
    }

    // Add donor to mock database
    const newDonor = addDonor({
      name,
      phone,
      whatsapp: whatsapp || undefined,
      bloodType,
      location,
    })

    console.log("✅ Donor registration completed successfully")

    return {
      success: true,
      message: "Registration successful! You'll receive alerts when your blood type is needed.",
    }
  } catch (error) {
    console.error("Donor registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}
