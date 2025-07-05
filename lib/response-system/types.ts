export interface DonorResponse {
  id: string
  requestId: string
  donorId: string
  donorName: string
  donorPhone: string
  response: "available" | "not_available"
  responseMethod: "sms" | "whatsapp" | "web"
  respondedAt: string
  language: "en" | "rw" | "fr"
  notes?: string
}

export interface ResponseStats {
  totalSent: number
  totalResponses: number
  availableCount: number
  notAvailableCount: number
  responseRate: number
}
