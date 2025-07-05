"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building, MapPin, Mail, FileText, Check, X, Eye, Users, Activity, Shield, LogOut } from "lucide-react"
import Link from "next/link"
import {
  approveHospital,
  rejectHospital,
  getPendingHospitals,
  getApprovedHospitals,
  getDashboardStatsAction, // <- Changed name
} from "./actions"

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

interface DashboardStats {
  totalHospitals: number
  pendingApprovals: number
  totalDonors: number
  activeRequests: number
}

export default function AdminDashboard() {
  const [pendingHospitals, setPendingHospitals] = useState<Hospital[]>([])
  const [approvedHospitals, setApprovedHospitals] = useState<Hospital[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalHospitals: 0,
    pendingApprovals: 0,
    totalDonors: 0,
    activeRequests: 0,
  })
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [pending, approved, dashboardStats] = await Promise.all([
        getPendingHospitals(),
        getApprovedHospitals(),
        getDashboardStatsAction(), // <- Changed name
      ])

      setPendingHospitals(pending)
      setApprovedHospitals(approved)
      setStats(dashboardStats)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (hospitalId: string) => {
    try {
      const result = await approveHospital(hospitalId)
      if (result.success) {
        await loadData() // Refresh data
      }
    } catch (error) {
      console.error("Error approving hospital:", error)
    }
  }

  const handleReject = async (hospitalId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    try {
      const result = await rejectHospital(hospitalId, rejectionReason)
      if (result.success) {
        setRejectionReason("")
        setSelectedHospital(null)
        await loadData() // Refresh data
      }
    } catch (error) {
      console.error("Error rejecting hospital:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHospitals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDonors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Management Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Approvals ({pendingHospitals.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved Hospitals ({approvedHospitals.length})</TabsTrigger>
          </TabsList>

          {/* Pending Hospitals */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Hospital Registrations</CardTitle>
                <CardDescription>Review and approve hospital registrations with RBC certificates</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingHospitals.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending hospital registrations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingHospitals.map((hospital) => (
                      <div key={hospital.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{hospital.name}</h3>
                              <Badge variant="secondary">Pending</Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {hospital.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {hospital.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Registered on {new Date(hospital.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Certificate
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>RBC Certificate - {hospital.name}</DialogTitle>
                                  <DialogDescription>Review the uploaded RBC certificate</DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <div className="border rounded-lg p-4 bg-gray-50">
                                    <p className="text-sm text-gray-600 mb-2">Certificate URL:</p>
                                    <p className="text-sm font-mono break-all">{hospital.certificateUrl}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      In a real application, this would display the actual certificate image/PDF
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              onClick={() => handleApprove(hospital.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" onClick={() => setSelectedHospital(hospital)}>
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Hospital Registration</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting {hospital.name}'s registration
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <Label htmlFor="reason">Rejection Reason</Label>
                                    <Textarea
                                      id="reason"
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      placeholder="Enter reason for rejection..."
                                      className="mt-2"
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedHospital(null)
                                        setRejectionReason("")
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleReject(hospital.id)}>
                                      Reject Hospital
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Hospitals */}
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Hospitals</CardTitle>
                <CardDescription>Hospitals that have been verified and approved</CardDescription>
              </CardHeader>
              <CardContent>
                {approvedHospitals.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No approved hospitals yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedHospitals.map((hospital) => (
                      <div key={hospital.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{hospital.name}</h3>
                              <Badge className="bg-green-100 text-green-800">Approved</Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {hospital.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {hospital.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Approved on {new Date(hospital.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
