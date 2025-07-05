"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, MessageSquare, Phone } from "lucide-react"

interface AlertStats {
  totalDonors: number
  alertsSent: number
  alertsFailed: number
}

interface AlertStatusProps {
  stats: AlertStats
  bloodType: string
  urgencyLevel: string
}

export function AlertStatus({ stats, bloodType, urgencyLevel }: AlertStatusProps) {
  const successRate = stats.totalDonors > 0 ? Math.round((stats.alertsSent / stats.totalDonors) * 100) : 0

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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Alert Status</CardTitle>
          <Badge className={getUrgencyColor(urgencyLevel)}>
            {urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}
          </Badge>
        </div>
        <CardDescription>{bloodType} blood request - Multi-language alerts sent</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Total Donors</p>
              <p className="text-2xl font-bold">{stats.totalDonors}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Alerts Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.alertsSent}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.alertsFailed}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              <strong>Multi-language support:</strong> Alerts sent in English, Kinyarwanda, and French based on donor
              preferences
            </p>
          </div>
        </div>

        {stats.alertsFailed > 0 && (
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> {stats.alertsFailed} alerts failed to send. Please try contacting donors directly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
