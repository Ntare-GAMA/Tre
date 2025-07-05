import { responseTemplates, formatResponseMessage } from "./templates"
import { sendSMS, sendWhatsApp } from "@/lib/alert-system/services"
import type { DonorResponse, ResponseStats } from "./types"

// Mock storage for responses (in real app, this would be database)
const mockResponses: DonorResponse[] = []

export async function processDonorResponse(
  requestId: string,
  donorPhone: string,
  response: "available" | "not_available",
  method: "sms" | "whatsapp" = "sms",
): Promise<{ success: boolean; message: string }> {
  try {
    // Find donor information (mock data)
    const donor = await findDonorByPhone(donorPhone)
    if (!donor) {
      return { success: false, message: "Donor not found" }
    }

    // Find blood request information
    const bloodRequest = await findBloodRequestById(requestId)
    if (!bloodRequest) {
      return { success: false, message: "Blood request not found" }
    }

    // Create response record
    const donorResponse: DonorResponse = {
      id: Date.now().toString(),
      requestId,
      donorId: donor.id,
      donorName: donor.name,
      donorPhone: donor.phone,
      response,
      responseMethod: method,
      respondedAt: new Date().toISOString(),
      language: (donor.language === "en" || donor.language === "rw" || donor.language === "fr") ? donor.language : "en",
    }

    // Store response
    mockResponses.push(donorResponse)

    // Send confirmation to donor
    await sendConfirmationToDonor(donorResponse, bloodRequest)

    // Notify hospital if donor is available
    if (response === "available") {
      await notifyHospitalOfAvailableDonor(donorResponse, bloodRequest)
    }

    console.log(`📝 Donor response recorded:`, {
      donor: donor.name,
      response,
      bloodType: bloodRequest.bloodType,
      method,
    })

    return {
      success: true,
      message: `Response recorded successfully. ${response === "available" ? "Hospital has been notified." : "Thank you for responding."}`,
    }
  } catch (error) {
    console.error("Error processing donor response:", error)
    return { success: false, message: "Failed to process response" }
  }
}

async function sendConfirmationToDonor(response: DonorResponse, bloodRequest: any) {
  const language = response.language
  const templates = responseTemplates[language] || responseTemplates.en
  const template = templates[response.response].confirmation

  const message = formatResponseMessage(template, {
    donorName: response.donorName,
    donorPhone: response.donorPhone,
    bloodType: bloodRequest.bloodType,
    hospitalName: bloodRequest.hospitalName,
  })

  // Send confirmation via same method they responded
  if (response.responseMethod === "whatsapp") {
    await sendWhatsApp(response.donorPhone, message)
  } else {
    await sendSMS(response.donorPhone, message)
  }
}

async function notifyHospitalOfAvailableDonor(response: DonorResponse, bloodRequest: any) {
  const language = "en" // Hospitals typically use English
  const template = responseTemplates[language].available.hospitalNotification

  const message = formatResponseMessage(template, {
    donorName: response.donorName,
    donorPhone: response.donorPhone,
    bloodType: bloodRequest.bloodType,
    hospitalName: bloodRequest.hospitalName,
  })

  // Send notification to hospital (mock hospital phone)
  const hospitalPhone = "+250788123456"
  await sendSMS(hospitalPhone, message)
}

// Mock functions (in real app, these would query the database)
async function findDonorByPhone(phone: string) {
  const mockDonors = [
    { id: "1", name: "Jean Baptiste", phone: "+250788111111", language: "rw" },
    { id: "2", name: "Marie Claire", phone: "+250788222222", language: "fr" },
    { id: "3", name: "John Smith", phone: "+250788333333", language: "en" },
    { id: "4", name: "Uwimana Alice", phone: "+250788444444", language: "rw" },
    { id: "5", name: "Pierre Nkurunziza", phone: "+250788555555", language: "fr" },
  ]

  return mockDonors.find((donor) => donor.phone === phone)
}

async function findBloodRequestById(requestId: string) {
  // Mock blood request data
  return {
    id: requestId,
    bloodType: "O+",
    hospitalName: "City General Hospital",
    urgencyLevel: "critical",
    quantityNeeded: 3,
  }
}

export async function getResponseStats(requestId: string): Promise<ResponseStats> {
  const responses = mockResponses.filter((r) => r.requestId === requestId)
  const totalSent = 10 // Mock: total alerts sent

  return {
    totalSent,
    totalResponses: responses.length,
    availableCount: responses.filter((r) => r.response === "available").length,
    notAvailableCount: responses.filter((r) => r.response === "not_available").length,
    responseRate: totalSent > 0 ? Math.round((responses.length / totalSent) * 100) : 0,
  }
}

export async function getDonorResponses(requestId: string): Promise<DonorResponse[]> {
  return mockResponses.filter((r) => r.requestId === requestId)
}
