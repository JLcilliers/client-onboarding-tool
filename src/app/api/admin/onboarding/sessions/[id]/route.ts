import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Fetch session
    const { data: sessionData, error: sessionError } = await supabase
      .from('onboarding_sessions')
      .select(`
        id,
        token,
        status,
        current_step,
        last_saved_at,
        submitted_at,
        created_at,
        logo_url,
        clients (
          client_name,
          primary_contact_name,
          primary_contact_email
        )
      `)
      .eq('id', id)
      .single();

    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Transform clients from array to single object
    const transformedSession = {
      ...sessionData,
      clients: Array.isArray(sessionData.clients)
        ? sessionData.clients[0] || null
        : sessionData.clients
    };

    // Fetch answers
    const { data: answersData, error: answersError } = await supabase
      .from('onboarding_answers')
      .select('*')
      .eq('session_id', id)
      .order('updated_at', { ascending: true });

    if (answersError) {
      console.error('Error fetching answers:', answersError);
    }

    return NextResponse.json({
      session: transformedSession,
      answers: answersData || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
