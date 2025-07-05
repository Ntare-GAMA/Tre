"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Building, Shield } from "lucide-react"
import { useTranslation } from "../lib/i18n/context"
import { LanguageSelector } from "../components/language-selector"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">{t("home.title")}</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <LanguageSelector />
              <Link href="/hospital/login">
                <Button variant="outline" size="sm">
                  {t("navigation.hospital_login")}
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  {t("navigation.admin_login")}
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.subtitle")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("home.description")}</p>
        </div>

        {/* Registration Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Hospital Registration */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">{t("home.hospital_registration")}</CardTitle>
              <CardDescription>{t("home.hospital_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  {t("hospital.rbc_certificate")} {t("common.required")}
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  {t("admin.pending_description")}
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  {t("hospital.available_donors")}
                </li>
              </ul>
              <Link href="/hospital/register" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700">{t("hospital.registration_title")}</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Donor Registration */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{t("home.donor_registration")}</CardTitle>
              <CardDescription>{t("home.donor_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  {t("donor.registration_description")}
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  {t("home.step3_description")}
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  {t("donor.registration_success")}
                </li>
              </ul>
              <Link href="/donor/register" className="block">
                <Button className="w-full bg-blue-600 hover:blue-700">{t("donor.registration_title")}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">{t("home.how_it_works")}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{t("home.step1_title")}</h4>
              <p className="text-gray-600">{t("home.step1_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{t("home.step2_title")}</h4>
              <p className="text-gray-600">{t("home.step2_description")}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{t("home.step3_title")}</h4>
              <p className="text-gray-600">{t("home.step3_description")}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2025 {t("home.title")}. {t("home.footer")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
