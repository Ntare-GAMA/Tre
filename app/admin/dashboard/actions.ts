"use server"

import { getHospitalsByStatus, updateHospitalStatus, getDashboardStats } from "@/lib/database/hospitals"

export async function getPendingHospitals() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return getHospitalsByStatus("pending")
}

export async function getApprovedHospitals() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return getHospitalsByStatus("approved")
}

export async function getDashboardStatsAction() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return getDashboardStats()
}

export async function approveHospital(hospitalId: string, adminId: string) {
  try {
    const updatedHospital = await updateHospitalStatus(hospitalId, "approved", adminId)

    if (!updatedHospital) {
      return { success: false, error: "Hospital not found" }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true, message: "Hospital approved successfully" }
  } catch (error) {
    console.error("Error approving hospital:", error)
    return { success: false, error: "Failed to approve hospital" }
  }
}

export async function rejectHospital(hospitalId: string, reason: string) {
  try {
    const updatedHospital = updateHospitalStatus(hospitalId, "rejected", reason)

    if (!updatedHospital) {
      return { success: false, error: "Hospital not found" }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true, message: "Hospital rejected successfully" }
  } catch (error) {
    console.error("Error rejecting hospital:", error)
    return { success: false, error: "Failed to reject hospital" }
  }
}
