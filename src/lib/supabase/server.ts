import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role for bypassing RLS
// ONLY use this on the server side for public token-based access

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createServiceRoleClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types for database operations
export interface OnboardingSession {
  id: string;
  agency_id: string;
  client_id: string;
  token: string;
  status: 'draft' | 'in_progress' | 'submitted';
  current_step: number;
  last_saved_at: string | null;
  submitted_at: string | null;
  logo_path: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface OnboardingAnswer {
  id: string;
  session_id: string;
  step_key: string;
  answers: Record<string, unknown>;
  completed: boolean;
  updated_at: string;
}

export interface Client {
  id: string;
  agency_id: string;
  client_name: string;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  created_at: string;
}

// Helper functions for common operations
export async function getSessionByToken(token: string): Promise<OnboardingSession | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('onboarding_sessions')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    return null;
  }

  return data as OnboardingSession;
}

export async function getSessionAnswers(sessionId: string): Promise<OnboardingAnswer[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('onboarding_answers')
    .select('*')
    .eq('session_id', sessionId)
    .order('updated_at', { ascending: true });

  if (error) {
    console.error('Error fetching answers:', error);
    return [];
  }

  return (data || []) as OnboardingAnswer[];
}

export async function upsertAnswer(
  sessionId: string,
  stepKey: string,
  answers: Record<string, unknown>,
  completed: boolean
): Promise<OnboardingAnswer | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('onboarding_answers')
    .upsert(
      {
        session_id: sessionId,
        step_key: stepKey,
        answers,
        completed,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'session_id,step_key',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting answer:', error);
    return null;
  }

  return data as OnboardingAnswer;
}

export async function updateSessionStep(
  sessionId: string,
  currentStep: number,
  status?: 'draft' | 'in_progress' | 'submitted'
): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const updateData: Partial<OnboardingSession> = {
    current_step: currentStep,
    last_saved_at: new Date().toISOString(),
  };

  if (status) {
    updateData.status = status;
    if (status === 'submitted') {
      updateData.submitted_at = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from('onboarding_sessions')
    .update(updateData)
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating session:', error);
    return false;
  }

  return true;
}

export async function createAuditEvent(
  sessionId: string,
  eventType: string,
  payload?: Record<string, unknown>
): Promise<void> {
  const supabase = createServiceRoleClient();

  await supabase.from('onboarding_audit_events').insert({
    session_id: sessionId,
    event_type: eventType,
    payload,
  });
}

// Generate signed URL for logo
export async function getSignedLogoUrl(logoPath: string): Promise<string | null> {
  if (!logoPath) return null;

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.storage
    .from('onboarding-logos')
    .createSignedUrl(logoPath, 3600); // 1 hour expiry

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}
