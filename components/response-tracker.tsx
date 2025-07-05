"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Phone, MessageSquare, Clock, Users } from "lucide-react"
import type { DonorResponse, ResponseStats } from "@/lib/response-system/types"

interface ResponseTrackerProps {
  requestId: string
  bloodType: string
  urgencyLevel: string
}

export function ResponseTracker({ requestId, bloodType, urgencyLevel }: ResponseTrackerProps) {
  const [responses, setResponses] = useState<DonorResponse[]>([])
  const [stats, setStats] = useState<ResponseStats>({
    totalSent: 0,
    totalResponses: 0,
    availableCount: 0,
    notAvailableCount: 0,
    responseRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResponses()
  }, [requestId])

  const loadResponses = async () => {
    setIsLoading(true)
    try {
      // Mock data - in real app, fetch from API
      const mockResponses: DonorResponse[] = [
        {
          id: "1",
          requestId,
          donorId: "1",
          donorName: "Jean Baptiste",
          donorPhone: "+250788111111",
          response: "available",
          responseMethod: "sms",
          respondedAt: new Date().toISOString(),
          language: "rw",
        },
        {
          id: "2",
          requestId,
          donorId: "2",
          donorName: "Marie Claire",
          donorPhone: "+250788222222",
          response: "not_available",
          responseMethod: "whatsapp",
          respondedAt: new Date(Date.now() - 3600000).toISOString(),
          language: "fr",
        },
        {
          id: "3",
          requestId,
          donorId: "3",
          donorName: "John Smith",
          donorPhone: "+250788333333",
          response: "available",
          responseMethod: "web",
          respondedAt: new Date(Date.now() - 7200000).toISOString(),
          language: "en",
        },
      ]

      const mockStats: ResponseStats = {
        totalSent: 8,
        totalResponses: mockResponses.length,
        availableCount: mockResponses.filter((r) => r.response === "available").length,
        notAvailableCount: mockResponses.filter((r) => r.response === "not_available").length,
        responseRate: Math.round((mockResponses.length / 8) * 100),
      }

      setResponses(mockResponses)
      setStats(mockStats)
    } catch (error) {
      console.error("Error loading responses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2">Loading responses...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Response Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Response Statistics
          </CardTitle>
          <CardDescription>Real-time responses for {bloodType} blood request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSent}</div>
              <div className="text-sm text-gray-600">Alerts Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalResponses}</div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.availableCount}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.responseRate}%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Donor Responses</CardTitle>
          <CardDescription>Individual responses from donors</CardDescription>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No responses yet</p>
              <p className="text-sm text-gray-500">Donors will appear here as they respond</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{response.donorName}</h3>
                        <Badge
                          className={
                            response.response === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {response.response === "available" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {response.response === "available" ? "Available" : "Not Available"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {response.language.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {response.donorPhone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {response.responseMethod.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(response.respondedAt).toLocaleString()}
                        </div>
                      </div>

                      {response.notes && <p className="text-sm text-gray-700 mt-2 italic">"{response.notes}"</p>}
                    </div>

                    {response.response === "available" && (
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
