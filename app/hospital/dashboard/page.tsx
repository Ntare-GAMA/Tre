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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building, Users, Droplets, MapPin, Phone, Clock, CheckCircle, Plus, LogOut } from "lucide-react"
import Link from "next/link"
// import { getAvailableDonors, getBloodRequests, getHospitalStats } from "./actions"
import { getBloodRequests, getHospitalStats } from "./actions"
// TODO: Implement or import getAvailableDonors if needed
// If you need createBloodRequest, ensure it is exported from './actions'

interface Donor {
  id: string
  name: string
  phone: string
  whatsapp?: string
  bloodType: string
  location: string
  distance: number
  lastDonation?: string
  isAvailable: boolean
}

interface BloodRequest {
  id: string
  bloodType: string
  urgencyLevel: "critical" | "urgent" | "routine"
  quantityNeeded: number
  status: "active" | "fulfilled" | "cancelled"
  createdAt: string
  responseCount: number
  availableCount: number
}

interface HospitalStats {
  totalRequests: number
  activeRequests: number
  totalDonors: number
  successfulMatches: number
}

export default function HospitalDashboard() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [stats, setStats] = useState<HospitalStats>({
    totalRequests: 0,
    activeRequests: 0,
    totalDonors: 0,
    successfulMatches: 0,
  })
  const [selectedBloodType, setSelectedBloodType] = useState("A+") // Updated default value
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const urgencyLevels = [
    { value: "critical", label: "Critical", color: "bg-red-600" },
    { value: "urgent", label: "Urgent", color: "bg-orange-600" },
    { value: "routine", label: "Routine", color: "bg-blue-600" },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [donorsData, requestsData, statsData] = await Promise.all([
        getAvailableDonors(),
        getBloodRequests(),
        getHospitalStats(),
      ])

      setDonors(donorsData)
      setBloodRequests(requestsData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRequest = async (formData: FormData) => {
    setIsCreatingRequest(true)
    try {
      const result = await createBloodRequest(formData)
      if (result.success) {
        await loadData() // Refresh data
        // Close dialog (you might want to add state for this)
      }
    } catch (error) {
      console.error("Error creating request:", error)
    } finally {
      setIsCreatingRequest(false)
    }
  }

  const filteredDonors = selectedBloodType ? donors.filter((donor) => donor.bloodType === selectedBloodType) : donors

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      case "routine":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <Building className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
                <p className="text-sm text-gray-600">City General Hospital</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Blood
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Blood Request</DialogTitle>
                    <DialogDescription>Request blood from nearby donors</DialogDescription>
                  </DialogHeader>
                  <form action={handleCreateRequest} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select name="bloodType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select name="urgency" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Needed (units)</Label>
                      <Input id="quantity" name="quantity" type="number" min="1" max="10" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea id="notes" name="notes" placeholder="Any additional information..." />
                    </div>

                    <Button type="submit" disabled={isCreatingRequest} className="w-full">
                      {isCreatingRequest ? "Creating Request..." : "Send Alert to Donors"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

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
                <Droplets className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Donors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDonors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Successful Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successfulMatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="donors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="donors">Available Donors ({filteredDonors.length})</TabsTrigger>
            <TabsTrigger value="requests">Blood Requests ({bloodRequests.length})</TabsTrigger>
          </TabsList>

          {/* Available Donors */}
          <TabsContent value="donors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Available Donors</CardTitle>
                    <CardDescription>Donors in your area ready to help</CardDescription>
                  </div>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">All Types</SelectItem> {/* Updated default value */}
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDonors.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {selectedBloodType ? `No ${selectedBloodType} donors available` : "No donors available"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredDonors.map((donor) => (
                      <div key={donor.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{donor.name}</h3>
                              <Badge className="bg-red-100 text-red-800">{donor.bloodType}</Badge>
                              {donor.isAvailable ? (
                                <Badge className="bg-green-100 text-green-800">Available</Badge>
                              ) : (
                                <Badge variant="secondary">Recently Donated</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {donor.phone}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {donor.distance}km away
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {donor.location}
                              </div>
                              {donor.lastDonation && (
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Last donated: {donor.lastDonation}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                            {donor.whatsapp && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                WhatsApp
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blood Requests */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Blood Requests</CardTitle>
                <CardDescription>Your recent blood requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {bloodRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No blood requests yet</p>
                    <p className="text-sm text-gray-500 mt-2">Create your first request to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bloodRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{request.bloodType} Blood</h3>
                              <Badge className={getUrgencyColor(request.urgencyLevel)}>
                                {request.urgencyLevel.charAt(0).toUpperCase() + request.urgencyLevel.slice(1)}
                              </Badge>
                              <Badge
                                className={
                                  request.status === "active"
                                    ? "bg-blue-100 text-blue-800"
                                    : request.status === "fulfilled"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                }
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4" />
                                {request.quantityNeeded} units needed
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {request.responseCount} responses
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {request.availableCount} available
                              </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                              Created {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              View Responses
                            </Button>
                            {request.status === "active" && (
                              <Button size="sm" variant="destructive">
                                Cancel
                              </Button>
                            )}
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
