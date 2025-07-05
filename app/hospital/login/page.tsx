"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function HospitalLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to hospital dashboard
    window.location.href = "/hospital/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Building className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Hospital Login</CardTitle>
          <CardDescription className="text-gray-600">Access your hospital dashboard to request blood</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input id="email" type="email" placeholder="hospital@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input id="password" type="password" placeholder="Enter password" required />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center space-y-2">
              <Link href="/hospital/register" className="text-sm text-red-600 hover:underline block">
                Don't have an account? Register here
              </Link>
              <Link href="/" className="text-sm text-blue-600 hover:underline block">
                Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
