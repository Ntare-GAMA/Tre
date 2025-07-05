"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Phone, MapPin, Clock, CheckCircle, XCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { LanguageSelector } from "@/components/language-selector"
import { submitDonorResponse } from "./actions"

interface BloodRequestDetails {
  id: string
  hospitalName: string
  bloodType: string
  urgencyLevel: "critical" | "urgent" | "routine"
  quantityNeeded: number
  location: string
  createdAt: string
  hospitalPhone: string
}

export default function DonorResponsePage({ params }: { params: { requestId: string } }) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<"available" | "not_available" | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Mock blood request details (in real app, fetch from API)
  const bloodRequest: BloodRequestDetails = {
    id: params.requestId,
    hospitalName: "City General Hospital",
    bloodType: "O+",
    urgencyLevel: "critical",
    quantityNeeded: 3,
    location: "Kigali, Gasabo District",
    createdAt: new Date().toISOString(),
    hospitalPhone: "+250788123456",
  }

  const handleSubmit = async (formData: FormData) => {
    if (!response) {
      setMessage({ type: "error", text: "Please select your availability" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    formData.append("response", response)
    formData.append("requestId", params.requestId)

    try {
      const result = await submitDonorResponse(formData)
      if (result.success) {
        setMessage({ type: "success", text: result.message ?? "Response submitted successfully" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to submit response" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "routine":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "🚨"
      case "urgent":
        return "⚡"
      case "routine":
        return "🏥"
      default:
        return "🩸"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">{t("home.title")}</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Blood Request Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                {getUrgencyIcon(bloodRequest.urgencyLevel)} Blood Donation Request
              </CardTitle>
              <Badge className={getUrgencyColor(bloodRequest.urgencyLevel)}>
                {t(`hospital.${bloodRequest.urgencyLevel}`)}
              </Badge>
            </div>
            <CardDescription>{bloodRequest.hospitalName} needs your help</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("hospital.blood_type")}</p>
                    <p className="text-2xl font-bold text-red-600">{bloodRequest.bloodType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("common.location")}</p>
                    <p className="font-semibold">{bloodRequest.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">{bloodRequest.quantityNeeded}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("hospital.quantity_needed")}</p>
                    <p className="font-semibold">
                      {bloodRequest.quantityNeeded} {t("hospital.units_needed")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hospital Contact</p>
                    <p className="font-semibold">{bloodRequest.hospitalPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {bloodRequest.urgencyLevel === "critical" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-semibold">Critical Request - Immediate Response Needed</p>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  This is an emergency situation. Please respond as soon as possible.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
            <CardDescription>Please let us know if you're available to donate blood</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              {/* Donor Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("common.name")}</Label>
                  <Input id="name" name="name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("common.phone")}</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+250788123456" required />
                </div>
              </div>

              {/* Availability Response */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Are you available to donate?</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setResponse("available")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      response === "available"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle
                        className={`w-6 h-6 ${response === "available" ? "text-green-600" : "text-gray-400"}`}
                      />
                      <div className="text-left">
                        <p className="font-semibold text-green-700">Yes, I'm Available</p>
                        <p className="text-sm text-gray-600">I can donate blood</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResponse("not_available")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      response === "not_available" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <XCircle
                        className={`w-6 h-6 ${response === "not_available" ? "text-red-600" : "text-gray-400"}`}
                      />
                      <div className="text-left">
                        <p className="font-semibold text-red-700">Not Available</p>
                        <p className="text-sm text-gray-600">I cannot donate right now</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information or questions..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !response}
                className={`w-full ${
                  response === "available"
                    ? "bg-green-600 hover:bg-green-700"
                    : response === "not_available"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-400"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
