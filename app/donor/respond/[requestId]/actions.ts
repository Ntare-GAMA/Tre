"use server"

import { processDonorResponse } from "@/lib/response-system/services"

export async function submitDonorResponse(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const response = formData.get("response") as "available" | "not_available"
    const requestId = formData.get("requestId") as string
    const notes = formData.get("notes") as string

    // Validate required fields
    if (!name || !phone || !response || !requestId) {
      return { success: false, error: "All required fields must be filled" }
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return { success: false, error: "Invalid phone number format" }
    }

    // Process the donor response
    const result = await processDonorResponse(requestId, phone, response, "sms")

    if (result.success) {
      return {
        success: true,
        message:
          response === "available"
            ? "Thank you! Your availability has been confirmed. The hospital will contact you shortly."
            : "Thank you for responding. We understand you're not available right now.",
      }
    } else {
      return { success: false, error: result.message }
    }
  } catch (error) {
    console.error("Error submitting donor response:", error)
    return { success: false, error: "Failed to submit response. Please try again." }
  }
}
