-- Supabase Schema for Save Life System
-- Note: Removed the problematic app.jwt_secret line

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'hospital', 'donor');
CREATE TYPE hospital_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE urgency_level AS ENUM ('critical', 'urgent', 'routine');
CREATE TYPE request_status AS ENUM ('active', 'fulfilled', 'cancelled');
CREATE TYPE response_type AS ENUM ('available', 'not_available');
CREATE TYPE response_method AS ENUM ('sms', 'whatsapp', 'web');
CREATE TYPE language_code AS ENUM ('en', 'rw', 'fr');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals table
CREATE TABLE public.hospitals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    certificate_url TEXT,
    status hospital_status DEFAULT 'pending',
    rejection_reason TEXT,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE public.donors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT,
    blood_type blood_type NOT NULL,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    language language_code DEFAULT 'en',
    is_available BOOLEAN DEFAULT true,
    last_donation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood requests table
CREATE TABLE public.blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    blood_type blood_type NOT NULL,
    urgency_level urgency_level NOT NULL,
    quantity_needed INTEGER NOT NULL,
    status request_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donor responses table
CREATE TABLE public.donor_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blood_request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    response response_type NOT NULL,
    response_method response_method NOT NULL,
    notes TEXT,
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blood_request_id, donor_id)
);

-- Alert logs table (for tracking sent alerts)
CREATE TABLE public.alert_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blood_request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- 'sms' or 'whatsapp'
    message_content TEXT NOT NULL,
    language language_code NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_hospitals_status ON public.hospitals(status);
CREATE INDEX idx_hospitals_location ON public.hospitals(latitude, longitude);
CREATE INDEX idx_donors_blood_type ON public.donors(blood_type);
CREATE INDEX idx_donors_location ON public.donors(latitude, longitude);
CREATE INDEX idx_donors_available ON public.donors(is_available);
CREATE INDEX idx_blood_requests_status ON public.blood_requests(status);
CREATE INDEX idx_blood_requests_hospital ON public.blood_requests(hospital_id);
CREATE INDEX idx_donor_responses_request ON public.donor_responses(blood_request_id);
CREATE INDEX idx_alert_logs_request ON public.alert_logs(blood_request_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Hospitals can read their own data
CREATE POLICY "Hospitals can read own data" ON public.hospitals
    FOR SELECT USING (user_id = auth.uid());

-- Admins can read all hospitals
CREATE POLICY "Admins can read all hospitals" ON public.hospitals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Hospitals can update their own data
CREATE POLICY "Hospitals can update own data" ON public.hospitals
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can update hospital status
CREATE POLICY "Admins can update hospitals" ON public.hospitals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Donors can read their own data
CREATE POLICY "Donors can read own data" ON public.donors
    FOR SELECT USING (user_id = auth.uid());

-- Hospitals can read approved donors
CREATE POLICY "Hospitals can read donors" ON public.donors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.hospitals h ON h.user_id = u.id
            WHERE u.id = auth.uid() AND u.role = 'hospital' AND h.status = 'approved'
        )
    );

-- Blood requests policies
CREATE POLICY "Hospitals can manage own requests" ON public.blood_requests
    FOR ALL USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE user_id = auth.uid()
        )
    );

-- Donors can read requests for their blood type
CREATE POLICY "Donors can read matching requests" ON public.blood_requests
    FOR SELECT USING (
        blood_type IN (
            SELECT blood_type FROM public.donors WHERE user_id = auth.uid()
        )
    );

-- Response policies
CREATE POLICY "Donors can manage own responses" ON public.donor_responses
    FOR ALL USING (
        donor_id IN (
            SELECT id FROM public.donors WHERE user_id = auth.uid()
        )
    );

-- Hospitals can read responses to their requests
CREATE POLICY "Hospitals can read responses" ON public.donor_responses
    FOR SELECT USING (
        blood_request_id IN (
            SELECT br.id FROM public.blood_requests br
            JOIN public.hospitals h ON h.id = br.hospital_id
            WHERE h.user_id = auth.uid()
        )
    );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON public.blood_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
