export interface AlertRequest {
  id: string
  hospitalId: string
  hospitalName: string
  bloodType: string
  urgencyLevel: "critical" | "urgent" | "routine"
  quantityNeeded: number
  location: string
  createdAt: string
}

export interface Donor {
  id: string
  name: string
  phone: string
  whatsapp?: string
  bloodType: string
  location: string
  language: "en" | "rw" | "fr"
  isAvailable: boolean
}

export interface AlertResponse {
  success: boolean
  sentCount: number
  failedCount: number
  errors?: string[]
}
