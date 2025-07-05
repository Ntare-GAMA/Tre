import { alertTemplates, formatAlertMessage } from "./templates"
import type { AlertRequest, Donor, AlertResponse } from "./types"

// Mock SMS service (in real app, integrate with Twilio, AWS SNS, etc.)
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    // Simulate SMS API call
    console.log(`📱 SMS to ${phone}:`, message)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate 95% success rate
    return Math.random() > 0.05
  } catch (error) {
    console.error("SMS Error:", error)
    return false
  }
}

// Mock WhatsApp service (in real app, integrate with WhatsApp Business API)
export async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  try {
    // Simulate WhatsApp API call
    console.log(`💬 WhatsApp to ${phone}:`, message)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Simulate 98% success rate
    return Math.random() > 0.02
  } catch (error) {
    console.error("WhatsApp Error:", error)
    return false
  }
}

export async function sendAlertToDonors(alertRequest: AlertRequest, donors: Donor[]): Promise<AlertResponse> {
  const results = {
    success: true,
    sentCount: 0,
    failedCount: 0,
    errors: [] as string[],
  }

  const hospitalPhone = "+250788123456" // Mock hospital phone

  // Filter donors by blood type and availability
  const eligibleDonors = donors.filter((donor) => donor.bloodType === alertRequest.bloodType && donor.isAvailable)

  console.log(`🎯 Sending alerts to ${eligibleDonors.length} eligible donors for ${alertRequest.bloodType} blood`)

  // Send alerts to each eligible donor
  for (const donor of eligibleDonors) {
    try {
      const language = donor.language || "en"
      const urgency = alertRequest.urgencyLevel

      // Get message templates for donor's language
      const templates = alertTemplates[language]?.[urgency] || alertTemplates.en[urgency]

      const messageData = {
        hospitalName: alertRequest.hospitalName,
        bloodType: alertRequest.bloodType,
        quantity: alertRequest.quantityNeeded,
        location: alertRequest.location,
        hospitalPhone,
      }

      // Send SMS
      const smsMessage = formatAlertMessage(templates.sms, messageData)
      const smsSuccess = await sendSMS(donor.phone, smsMessage)

      // Send WhatsApp if available
      let whatsappSuccess = true
      if (donor.whatsapp) {
        const whatsappMessage = formatAlertMessage(templates.whatsapp, messageData)
        whatsappSuccess = await sendWhatsApp(donor.whatsapp, whatsappMessage)
      }

      if (smsSuccess || whatsappSuccess) {
        results.sentCount++
      } else {
        results.failedCount++
        results.errors.push(`Failed to reach ${donor.name} (${donor.phone})`)
      }
    } catch (error) {
      results.failedCount++
      results.errors.push(`Error sending to ${donor.name}: ${error}`)
    }
  }

  if (results.failedCount > 0) {
    results.success = false
  }

  return results
}

// Function to find nearby donors (mock implementation)
export async function findNearbyDonors(hospitalLocation: string, bloodType: string, radiusKm = 10): Promise<Donor[]> {
  // Mock donors data with language preferences
  const mockDonors: Donor[] = [
    {
      id: "1",
      name: "Jean Baptiste",
      phone: "+250788111111",
      whatsapp: "+250788111111",
      bloodType: "O+",
      location: "Kigali, Gasabo",
      language: "rw",
      isAvailable: true,
    },
    {
      id: "2",
      name: "Marie Claire",
      phone: "+250788222222",
      whatsapp: "+250788222222",
      bloodType: "A+",
      location: "Kigali, Kicukiro",
      language: "fr",
      isAvailable: true,
    },
    {
      id: "3",
      name: "John Smith",
      phone: "+250788333333",
      bloodType: "B+",
      location: "Kigali, Nyarugenge",
      language: "en",
      isAvailable: true,
    },
    {
      id: "4",
      name: "Uwimana Alice",
      phone: "+250788444444",
      whatsapp: "+250788444444",
      bloodType: "O+",
      location: "Kigali, Gasabo",
      language: "rw",
      isAvailable: true,
    },
    {
      id: "5",
      name: "Pierre Nkurunziza",
      phone: "+250788555555",
      bloodType: "AB+",
      location: "Kigali, Kicukiro",
      language: "fr",
      isAvailable: false, // Recently donated
    },
  ]

  // Filter by blood type and availability
  return mockDonors.filter((donor) => donor.bloodType === bloodType && donor.isAvailable)
}
