import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, getSessionAnswers, updateSessionStep, createAuditEvent } from '@/lib/supabase/server';
import { onboardingSteps } from '@/lib/onboarding/steps';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

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

    // Check if already submitted
    if (session.status === 'submitted') {
      return NextResponse.json(
        { error: 'Session has already been submitted' },
        { status: 400 }
      );
    }

    // Get all answers to verify completion
    const answers = await getSessionAnswers(session.id);
    const answeredSteps = new Set(answers.filter(a => a.completed).map(a => a.step_key));

    // Check required steps are completed (at minimum, first step and final review)
    const requiredSteps = ['business_overview', 'final_review'];
    const missingSteps = requiredSteps.filter(step => !answeredSteps.has(step));

    if (missingSteps.length > 0) {
      return NextResponse.json(
        {
          error: 'Required steps not completed',
          missingSteps,
        },
        { status: 400 }
      );
    }

    // Update session status to submitted
    const success = await updateSessionStep(session.id, onboardingSteps.length, 'submitted');

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit session' },
        { status: 500 }
      );
    }

    // Create audit event
    await createAuditEvent(session.id, 'session_submitted', {
      totalStepsCompleted: answeredSteps.size,
      totalSteps: onboardingSteps.length,
    });

    return NextResponse.json({
      success: true,
      submittedAt: new Date().toISOString(),
      message: 'Thank you! Your onboarding has been submitted successfully.',
    });
  } catch (error) {
    console.error('Error submitting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
