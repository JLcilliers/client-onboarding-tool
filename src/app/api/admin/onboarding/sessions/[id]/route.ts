import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { computeAccessChecklist, generateMissingAccessText, AnswersByStep } from '@/lib/onboarding/accessChecklist';

interface AnswerRow {
  step_key: string;
  answers: Record<string, unknown>;
  completed: boolean;
  updated_at: string;
}

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

    // Build answers by step for access checklist
    const answersByStep: AnswersByStep = {};
    ((answersData || []) as AnswerRow[]).forEach(answer => {
      answersByStep[answer.step_key] = answer.answers || {};
    });

    // Compute access checklist
    const accessChecklist = computeAccessChecklist(answersByStep);
    const missingAccessText = generateMissingAccessText(accessChecklist);

    return NextResponse.json({
      session: transformedSession,
      answers: answersData || [],
      accessChecklist: {
        items: accessChecklist.items,
        missingCount: accessChecklist.missingCount,
        presentCount: accessChecklist.presentCount,
        notApplicableCount: accessChecklist.notApplicableCount,
        missingKeys: accessChecklist.missingKeys,
        presentKeys: accessChecklist.presentKeys,
        missingAccessText,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // First, get the session to find the client_id
    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('onboarding_sessions')
      .select('client_id')
      .eq('id', id)
      .single();

    if (sessionFetchError) {
      console.error('Error fetching session:', sessionFetchError);
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const clientId = sessionData.client_id;

    // Delete answers first (due to foreign key constraint)
    const { error: answersError } = await supabase
      .from('onboarding_answers')
      .delete()
      .eq('session_id', id);

    if (answersError) {
      console.error('Error deleting answers:', answersError);
      return NextResponse.json(
        { error: 'Failed to delete session answers' },
        { status: 500 }
      );
    }

    // Delete the session
    const { error: sessionError } = await supabase
      .from('onboarding_sessions')
      .delete()
      .eq('id', id);

    if (sessionError) {
      console.error('Error deleting session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: 500 }
      );
    }

    // Delete the client (each client has one session in this tool)
    if (clientId) {
      const { error: clientError } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (clientError) {
        console.error('Error deleting client:', clientError);
        // Don't fail the request, session is already deleted
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
