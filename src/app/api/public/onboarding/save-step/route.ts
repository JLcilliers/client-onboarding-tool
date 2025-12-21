import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, upsertAnswer, updateSessionStep, createAuditEvent } from '@/lib/supabase/server';
import { validateStepData, getStepIndex } from '@/lib/onboarding/steps';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, stepKey, stepIndex, answers, completed } = body;

    // Validate required fields
    if (!token || !stepKey || typeof stepIndex !== 'number' || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: token, stepKey, stepIndex, answers' },
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

    // Check if session is already submitted
    if (session.status === 'submitted') {
      return NextResponse.json(
        { error: 'Session has already been submitted' },
        { status: 400 }
      );
    }

    // Validate step data if marking as completed
    if (completed) {
      const validation = validateStepData(stepKey, answers);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', validationErrors: validation.errors },
          { status: 400 }
        );
      }
    }

    // Upsert the answer
    const savedAnswer = await upsertAnswer(session.id, stepKey, answers, completed || false);

    if (!savedAnswer) {
      return NextResponse.json(
        { error: 'Failed to save answers' },
        { status: 500 }
      );
    }

    // Update session current step if completed and moving forward
    let newCurrentStep = session.current_step;
    if (completed && stepIndex >= session.current_step) {
      newCurrentStep = stepIndex + 1;
      const newStatus = session.status === 'draft' ? 'in_progress' : session.status;
      await updateSessionStep(session.id, newCurrentStep, newStatus);
    }

    // Create audit event
    await createAuditEvent(session.id, 'step_saved', {
      stepKey,
      stepIndex,
      completed,
      answersCount: Object.keys(answers).length,
    });

    return NextResponse.json({
      success: true,
      currentStep: newCurrentStep,
      lastSavedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
