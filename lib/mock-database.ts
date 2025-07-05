// Simple in-memory database for development/testing
// In production, this would be replaced with real database calls

interface Hospital {
  id: string
  name: string
  email: string
  location: string
  certificateUrl: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  rejectionReason?: string
}

interface Donor {
  id: string
  name: string
  phone: string
  whatsapp?: string
  bloodType: string
  location: string
  createdAt: string
}

// In-memory storage (resets when server restarts)
const hospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    email: "admin@citygeneral.com",
    location: "123 Main Street, Downtown, NY 10001",
    certificateUrl: "/certificates/city-general-rbc.pdf",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "St. Mary's Medical Center",
    email: "contact@stmarys.com",
    location: "456 Oak Avenue, Midtown, NY 10002",
    certificateUrl: "/certificates/st-marys-rbc.pdf",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const donors: Donor[] = [
  {
    id: "1",
    name: "Jean Baptiste",
    phone: "+250788111111",
    whatsapp: "+250788111111",
    bloodType: "O+",
    location: "Gasabo District",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Marie Claire",
    phone: "+250788222222",
    bloodType: "A+",
    location: "Kicukiro District",
    createdAt: new Date().toISOString(),
  },
]

// Hospital functions
export function addHospital(hospitalData: Omit<Hospital, "id" | "createdAt">) {
  const newHospital: Hospital = {
    ...hospitalData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  hospitals.push(newHospital)
  console.log("🏥 Hospital added to mock database:", newHospital.name)
  return newHospital
}

export function getHospitalsByStatus(status: "pending" | "approved" | "rejected") {
  return hospitals.filter((hospital) => hospital.status === status)
}

export function getAllHospitals() {
  return hospitals
}

export function updateHospitalStatus(hospitalId: string, status: "approved" | "rejected", rejectionReason?: string) {
  const hospitalIndex = hospitals.findIndex((h) => h.id === hospitalId)
  if (hospitalIndex !== -1) {
    hospitals[hospitalIndex].status = status
    if (rejectionReason) {
      hospitals[hospitalIndex].rejectionReason = rejectionReason
    }
    console.log(`🏥 Hospital ${hospitals[hospitalIndex].name} status updated to: ${status}`)
    return hospitals[hospitalIndex]
  }
  return null
}

// Donor functions
export function addDonor(donorData: Omit<Donor, "id" | "createdAt">) {
  const newDonor: Donor = {
    ...donorData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  donors.push(newDonor)
  console.log("🩸 Donor added to mock database:", newDonor.name)
  return newDonor
}

export function getAllDonors() {
  return donors
}

// Stats functions
export function getDashboardStats() {
  return {
    totalHospitals: hospitals.length,
    pendingApprovals: hospitals.filter((h) => h.status === "pending").length,
    totalDonors: donors.length,
    activeRequests: 3, // Mock active requests
  }
}
