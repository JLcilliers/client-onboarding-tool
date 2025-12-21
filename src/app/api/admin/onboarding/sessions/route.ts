import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
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
          primary_contact_email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Transform clients from array to single object
    const transformedData = (data || []).map(session => ({
      ...session,
      clients: Array.isArray(session.clients)
        ? session.clients[0] || null
        : session.clients
    }));

    return NextResponse.json({ sessions: transformedData });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
