"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, MapPin, Mail, Building } from "lucide-react"
import { registerHospital } from "./actions"

export default function HospitalRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [certificate, setCertificate] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    console.log("🚀 Form submission started...")
    setIsSubmitting(true)
    setMessage(null)

    try {
      console.log("📤 Calling registerHospital action...")
      const result = await registerHospital(formData)
      console.log("📥 Action result:", result)

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Registration successful!" })
        // Reset form
        const form = document.getElementById("hospital-form") as HTMLFormElement
        form?.reset()
        setCertificate(null)
      } else {
        setMessage({ type: "error", text: result.error || "Registration failed" })
      }
    } catch (error) {
      console.error("💥 Form submission error:", error)
      setMessage({
        type: "error",
        text: `Form submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log("📁 File selected:", file ? `${file.name} (${file.size} bytes, ${file.type})` : "None")

    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        console.error("❌ Invalid file type:", file.type)
        setMessage({ type: "error", text: `Invalid file type: ${file.type}. Please upload a PDF, JPG, or PNG file` })
        e.target.value = "" // Clear the input
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error("❌ File too large:", file.size)
        setMessage({ type: "error", text: "File size must be less than 5MB" })
        e.target.value = "" // Clear the input
        return
      }

      setCertificate(file)
      setMessage(null)
      console.log("✅ File validation passed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Building className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Hospital Registration</CardTitle>
          <CardDescription className="text-gray-600">
            Register your hospital to connect with blood donors. Your registration will be reviewed by our admin team.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="hospital-form" action={handleSubmit} className="space-y-6">
            {/* Hospital Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Hospital Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter hospital name"
                required
                className="w-full"
                minLength={2}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hospital@example.com"
                required
                className="w-full"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a secure password (min 8 characters)"
                required
                minLength={8}
                className="w-full"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Hospital Location *
              </Label>
              <Textarea
                id="location"
                name="location"
                placeholder="Enter complete hospital address with city and state"
                required
                className="w-full min-h-[80px]"
                minLength={10}
              />
            </div>

            {/* RBC Certificate Upload */}
            <div className="space-y-2">
              <Label htmlFor="certificate" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                RBC Certificate *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="certificate"
                  name="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label htmlFor="certificate" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {certificate ? (
                      <span className="text-green-600 font-medium">
                        ✅ {certificate.name} ({Math.round(certificate.size / 1024)}KB)
                      </span>
                    ) : (
                      "Click to upload RBC certificate"
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
                </label>
              </div>
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
                <div className="font-medium mb-1">{message.type === "success" ? "✅ Success!" : "❌ Error"}</div>
                <div className="text-sm">{message.text}</div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !certificate}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Registration"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              * Required fields. Your registration will be reviewed by our admin team. You'll receive an email
              notification once approved.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
