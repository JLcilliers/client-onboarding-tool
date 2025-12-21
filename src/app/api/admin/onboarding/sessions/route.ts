import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

const TOTAL_STEPS = 12;

interface ClientData {
  client_name: string;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
}

interface SessionWithClient {
  id: string;
  token: string;
  status: string;
  current_step: number;
  last_saved_at: string | null;
  submitted_at: string | null;
  created_at: string;
  clients: ClientData | ClientData[] | null;
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    // Fetch sessions with client info
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('onboarding_sessions')
      .select(`
        id,
        token,
        status,
        current_step,
        last_saved_at,
        submitted_at,
        created_at,
        clients (
          client_name,
          primary_contact_name,
          primary_contact_email
        )
      `) as { data: SessionWithClient[] | null; error: Error | null };

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Fetch completed steps count for all sessions
    const { data: answersData, error: answersError } = await supabase
      .from('onboarding_answers')
      .select('session_id, completed')
      .eq('completed', true);

    if (answersError) {
      console.error('Error fetching answers:', answersError);
    }

    // Build a map of session_id -> completed steps count
    const completedStepsMap: Record<string, number> = {};
    (answersData || []).forEach(answer => {
      completedStepsMap[answer.session_id] = (completedStepsMap[answer.session_id] || 0) + 1;
    });

    // Transform and enrich sessions with progress data
    const enrichedSessions = (sessionsData || []).map(session => {
      const completedSteps = completedStepsMap[session.id] || 0;
      const progressPercent = Math.round((completedSteps / TOTAL_STEPS) * 100);

      return {
        id: session.id,
        token: session.token,
        status: session.status,
        currentStep: session.current_step,
        lastSavedAt: session.last_saved_at,
        submittedAt: session.submitted_at,
        createdAt: session.created_at,
        completedSteps,
        totalSteps: TOTAL_STEPS,
        progressPercent,
        clientName: Array.isArray(session.clients)
          ? session.clients[0]?.client_name || 'Unknown Client'
          : session.clients?.client_name || 'Unknown Client',
        primaryContactName: Array.isArray(session.clients)
          ? session.clients[0]?.primary_contact_name || null
          : session.clients?.primary_contact_name || null,
        primaryContactEmail: Array.isArray(session.clients)
          ? session.clients[0]?.primary_contact_email || null
          : session.clients?.primary_contact_email || null,
      };
    });

    // Sort: active sessions first (draft/in_progress), then by last_saved_at desc, then created_at desc
    enrichedSessions.sort((a, b) => {
      // Submitted sessions go to the bottom
      const aIsActive = a.status !== 'submitted' ? 1 : 0;
      const bIsActive = b.status !== 'submitted' ? 1 : 0;
      if (aIsActive !== bIsActive) return bIsActive - aIsActive;

      // Then sort by last_saved_at (most recent first)
      const aLastSaved = a.lastSavedAt ? new Date(a.lastSavedAt).getTime() : 0;
      const bLastSaved = b.lastSavedAt ? new Date(b.lastSavedAt).getTime() : 0;
      if (aLastSaved !== bLastSaved) return bLastSaved - aLastSaved;

      // Finally sort by created_at (most recent first)
      const aCreated = new Date(a.createdAt).getTime();
      const bCreated = new Date(b.createdAt).getTime();
      return bCreated - aCreated;
    });

    return NextResponse.json({ sessions: enrichedSessions });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
