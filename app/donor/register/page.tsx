"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, Phone, MapPin, Droplets } from "lucide-react"
import Link from "next/link"
import { registerDonor } from "./actions"

export default function DonorRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [bloodType, setBloodType] = useState("")

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    // Add blood type to form data
    formData.append("bloodType", bloodType)

    try {
      const result = await registerDonor(formData)
      if (result.success) {
        setMessage({
          type: "success",
          text: "Registration successful! You'll receive alerts when your blood type is needed.",
        })
        // Reset form
        const form = document.getElementById("donor-form") as HTMLFormElement
        form?.reset()
        setBloodType("")
      } else {
        setMessage({ type: "error", text: result.error || "Registration failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Donor Registration</CardTitle>
          <CardDescription className="text-gray-600">
            Join our network of life-saving blood donors. Get alerts when your blood type is needed nearby.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="donor-form" action={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Full Name
              </Label>
              <Input id="name" name="name" placeholder="Enter your full name" required className="w-full" />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input id="phone" name="phone" type="tel" placeholder="+1234567890" required className="w-full" />
            </div>

            {/* WhatsApp Number (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
              <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+1234567890" className="w-full" />
              <p className="text-xs text-gray-500">Leave blank if same as phone number</p>
            </div>

            {/* Blood Type */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Blood Type
              </Label>
              <Select value={bloodType} onValueChange={setBloodType} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your blood type" />
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

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Textarea
                id="location"
                name="location"
                placeholder="Enter your address (city, state, area)"
                required
                className="w-full min-h-[80px]"
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
              disabled={isSubmitting || !bloodType}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Registering..." : "Register as Donor"}
            </Button>

            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
