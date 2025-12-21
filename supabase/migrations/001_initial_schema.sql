-- =============================================
-- Client Onboarding Tool - Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Agency Accounts (linked to Supabase Auth)
CREATE TABLE agency_accounts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    agency_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_accounts(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    primary_contact_name TEXT,
    primary_contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Onboarding Sessions
CREATE TABLE onboarding_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_accounts(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'submitted')),
    current_step INTEGER DEFAULT 0 NOT NULL,
    last_saved_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    logo_path TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Onboarding Answers
CREATE TABLE onboarding_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    step_key TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(session_id, step_key)
);

-- Audit Events (optional but valuable)
CREATE TABLE onboarding_audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_clients_agency_id ON clients(agency_id);
CREATE INDEX idx_sessions_agency_id ON onboarding_sessions(agency_id);
CREATE INDEX idx_sessions_client_id ON onboarding_sessions(client_id);
CREATE INDEX idx_sessions_token ON onboarding_sessions(token);
CREATE INDEX idx_answers_session_id ON onboarding_answers(session_id);
CREATE INDEX idx_audit_session_id ON onboarding_audit_events(session_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE agency_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_audit_events ENABLE ROW LEVEL SECURITY;

-- Agency Accounts: Users can only see their own account
CREATE POLICY "Users can view own agency account"
    ON agency_accounts FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own agency account"
    ON agency_accounts FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own agency account"
    ON agency_accounts FOR UPDATE
    USING (auth.uid() = id);

-- Clients: Agency users can only see their own clients
CREATE POLICY "Agency users can view own clients"
    ON clients FOR SELECT
    USING (agency_id = auth.uid());

CREATE POLICY "Agency users can insert own clients"
    ON clients FOR INSERT
    WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agency users can update own clients"
    ON clients FOR UPDATE
    USING (agency_id = auth.uid());

CREATE POLICY "Agency users can delete own clients"
    ON clients FOR DELETE
    USING (agency_id = auth.uid());

-- Onboarding Sessions: Agency users can only see their own sessions
CREATE POLICY "Agency users can view own sessions"
    ON onboarding_sessions FOR SELECT
    USING (agency_id = auth.uid());

CREATE POLICY "Agency users can insert own sessions"
    ON onboarding_sessions FOR INSERT
    WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agency users can update own sessions"
    ON onboarding_sessions FOR UPDATE
    USING (agency_id = auth.uid());

CREATE POLICY "Agency users can delete own sessions"
    ON onboarding_sessions FOR DELETE
    USING (agency_id = auth.uid());

-- Onboarding Answers: Agency users can only see answers for their sessions
CREATE POLICY "Agency users can view own session answers"
    ON onboarding_answers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM onboarding_sessions
            WHERE onboarding_sessions.id = onboarding_answers.session_id
            AND onboarding_sessions.agency_id = auth.uid()
        )
    );

CREATE POLICY "Agency users can insert own session answers"
    ON onboarding_answers FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM onboarding_sessions
            WHERE onboarding_sessions.id = onboarding_answers.session_id
            AND onboarding_sessions.agency_id = auth.uid()
        )
    );

CREATE POLICY "Agency users can update own session answers"
    ON onboarding_answers FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM onboarding_sessions
            WHERE onboarding_sessions.id = onboarding_answers.session_id
            AND onboarding_sessions.agency_id = auth.uid()
        )
    );

-- Audit Events: Agency users can only see audit events for their sessions
CREATE POLICY "Agency users can view own audit events"
    ON onboarding_audit_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM onboarding_sessions
            WHERE onboarding_sessions.id = onboarding_audit_events.session_id
            AND onboarding_sessions.agency_id = auth.uid()
        )
    );

CREATE POLICY "Agency users can insert own audit events"
    ON onboarding_audit_events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM onboarding_sessions
            WHERE onboarding_sessions.id = onboarding_audit_events.session_id
            AND onboarding_sessions.agency_id = auth.uid()
        )
    );

-- =============================================
-- STORAGE BUCKET
-- =============================================

-- Create the onboarding-logos bucket (run in Supabase Dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('onboarding-logos', 'onboarding-logos', false);

-- Storage policies for the onboarding-logos bucket
-- Agency users can upload logos to their own folder
-- CREATE POLICY "Agency users can upload logos"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--         bucket_id = 'onboarding-logos' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- Agency users can view their own logos
-- CREATE POLICY "Agency users can view own logos"
--     ON storage.objects FOR SELECT
--     USING (
--         bucket_id = 'onboarding-logos' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to generate a secure random token
CREATE OR REPLACE FUNCTION generate_secure_token()
RETURNS TEXT AS $$
DECLARE
    token TEXT;
BEGIN
    token := encode(gen_random_bytes(32), 'hex');
    RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Function to update last_saved_at timestamp
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE onboarding_sessions
    SET last_saved_at = NOW()
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update session timestamp when answers are saved
CREATE TRIGGER trigger_update_session_timestamp
    AFTER INSERT OR UPDATE ON onboarding_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_session_timestamp();

-- Function to update updated_at on answers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on answers
CREATE TRIGGER trigger_answers_updated_at
    BEFORE UPDATE ON onboarding_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
