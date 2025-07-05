export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: "admin" | "hospital" | "donor"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: "admin" | "hospital" | "donor"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "hospital" | "donor"
          created_at?: string
          updated_at?: string
        }
      }
      hospitals: {
        Row: {
          id: string
          user_id: string | null
          name: string
          location: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          certificate_url: string | null
          status: "pending" | "approved" | "rejected"
          rejection_reason: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          location: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          certificate_url?: string | null
          status?: "pending" | "approved" | "rejected"
          rejection_reason?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          location?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          certificate_url?: string | null
          status?: "pending" | "approved" | "rejected"
          rejection_reason?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      donors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          phone: string
          whatsapp_number: string | null
          blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
          location: string
          latitude: number | null
          longitude: number | null
          language: "en" | "rw" | "fr"
          is_available: boolean
          last_donation_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          phone: string
          whatsapp_number?: string | null
          blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
          location: string
          latitude?: number | null
          longitude?: number | null
          language?: "en" | "rw" | "fr"
          is_available?: boolean
          last_donation_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          phone?: string
          whatsapp_number?: string | null
          blood_type?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
          location?: string
          latitude?: number | null
          longitude?: number | null
          language?: "en" | "rw" | "fr"
          is_available?: boolean
          last_donation_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blood_requests: {
        Row: {
          id: string
          hospital_id: string | null
          blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
          urgency_level: "critical" | "urgent" | "routine"
          quantity_needed: number
          status: "active" | "fulfilled" | "cancelled"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hospital_id?: string | null
          blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
          urgency_level: "critical" | "urgent" | "routine"
          quantity_needed: number
          status?: "active" | "fulfilled" | "cancelled"
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hospital_id?: string | null
          blood_type?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
          urgency_level?: "critical" | "urgent" | "routine"
          quantity_needed?: number
          status?: "active" | "fulfilled" | "cancelled"
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      donor_responses: {
        Row: {
          id: string
          blood_request_id: string | null
          donor_id: string | null
          response: "available" | "not_available"
          response_method: "sms" | "whatsapp" | "web"
          notes: string | null
          responded_at: string
        }
        Insert: {
          id?: string
          blood_request_id?: string | null
          donor_id?: string | null
          response: "available" | "not_available"
          response_method: "sms" | "whatsapp" | "web"
          notes?: string | null
          responded_at?: string
        }
        Update: {
          id?: string
          blood_request_id?: string | null
          donor_id?: string | null
          response?: "available" | "not_available"
          response_method?: "sms" | "whatsapp" | "web"
          notes?: string | null
          responded_at?: string
        }
      }
      alert_logs: {
        Row: {
          id: string
          blood_request_id: string | null
          donor_id: string | null
          alert_type: string
          message_content: string
          language: "en" | "rw" | "fr"
          sent_at: string
          delivery_status: string
          error_message: string | null
        }
        Insert: {
          id?: string
          blood_request_id?: string | null
          donor_id?: string | null
          alert_type: string
          message_content: string
          language: "en" | "rw" | "fr"
          sent_at?: string
          delivery_status?: string
          error_message?: string | null
        }
        Update: {
          id?: string
          blood_request_id?: string | null
          donor_id?: string | null
          alert_type?: string
          message_content?: string
          language?: "en" | "rw" | "fr"
          sent_at?: string
          delivery_status?: string
          error_message?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "hospital" | "donor"
      hospital_status: "pending" | "approved" | "rejected"
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      urgency_level: "critical" | "urgent" | "routine"
      request_status: "active" | "fulfilled" | "cancelled"
      response_type: "available" | "not_available"
      response_method: "sms" | "whatsapp" | "web"
      language_code: "en" | "rw" | "fr"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
