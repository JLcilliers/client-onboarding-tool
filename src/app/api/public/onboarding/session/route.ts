import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, getSessionAnswers, getSignedLogoUrl, createAuditEvent } from '@/lib/supabase/server';
import { onboardingSteps } from '@/lib/onboarding/steps';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Get session by token
    const session = await getSessionByToken(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Get all answers for this session
    const answers = await getSessionAnswers(session.id);

    // Get signed logo URL if exists
    let logoUrl = session.logo_url;
    if (session.logo_path && !logoUrl) {
      logoUrl = await getSignedLogoUrl(session.logo_path);
    }

    // Create audit event for session access
    await createAuditEvent(session.id, 'session_accessed', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // Format answers by step key
    const answersByStep: Record<string, { answers: Record<string, unknown>; completed: boolean }> = {};
    answers.forEach(answer => {
      answersByStep[answer.step_key] = {
        answers: answer.answers,
        completed: answer.completed,
      };
    });

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        currentStep: session.current_step,
        logoUrl,
        lastSavedAt: session.last_saved_at,
        submittedAt: session.submitted_at,
      },
      answers: answersByStep,
      steps: onboardingSteps.map(step => ({
        key: step.key,
        title: step.title,
        description: step.description,
        estimatedTime: step.estimatedTime,
      })),
      totalSteps: onboardingSteps.length,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
