'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { onboardingSteps, validateStepData, getMissingRequiredFields } from '@/lib/onboarding/steps';
import StepRenderer from './StepRenderer';
import SpinnerInterstitial from './SpinnerInterstitial';

const CLIXSY_LOGO_URL = 'https://res.cloudinary.com/dovgh19xr/image/upload/v1766427227/new_logo_nvrux0.svg';

interface WizardProps {
  token: string;
  initialStep: number;
  initialAnswers: Record<string, { answers: Record<string, unknown>; completed: boolean }>;
  sessionStatus: 'draft' | 'in_progress' | 'submitted';
}

export default function Wizard({
  token,
  initialStep,
  initialAnswers,
  sessionStatus,
}: WizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>(() => {
    const initial: Record<string, Record<string, unknown>> = {};
    Object.entries(initialAnswers).forEach(([key, value]) => {
      initial[key] = value.answers;
    });
    return initial;
  });
  const [completedStepsState, setCompletedStepsState] = useState<string[]>(() => {
    return Object.entries(initialAnswers)
      .filter(([, value]) => value.completed)
      .map(([key]) => key);
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(sessionStatus === 'submitted');

  const currentStep = onboardingSteps[currentStepIndex];
  const stepAnswers = answers[currentStep?.key] || {};

  // Calculate missing required fields
  const missingFields = useMemo(() => {
    return getMissingRequiredFields(answers);
  }, [answers]);

  // Group missing fields by step
  const missingFieldsByStep = useMemo(() => {
    const grouped: Record<string, { stepTitle: string; stepIndex: number; fields: { fieldName: string; fieldLabel: string }[] }> = {};
    missingFields.forEach((field) => {
      if (!grouped[field.stepKey]) {
        grouped[field.stepKey] = {
          stepTitle: field.stepTitle,
          stepIndex: field.stepIndex,
          fields: [],
        };
      }
      grouped[field.stepKey].fields.push({
        fieldName: field.fieldName,
        fieldLabel: field.fieldLabel,
      });
    });
    return grouped;
  }, [missingFields]);

  // Handle field change
  const handleFieldChange = useCallback((name: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep.key]: {
        ...prev[currentStep.key],
        [name]: value,
      },
    }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setSaveError(null);
  }, [currentStep?.key]);

  // Save step to server
  const saveStep = async (completed: boolean): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/public/onboarding/save-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          stepKey: currentStep.key,
          stepIndex: currentStepIndex,
          answers: stepAnswers,
          completed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.validationErrors) {
          setErrors(data.validationErrors);
        }
        throw new Error(data.error || 'Failed to save');
      }

      if (completed && !completedStepsState.includes(currentStep.key)) {
        setCompletedStepsState((prev) => [...prev, currentStep.key]);
      }

      setLastSaved(new Date());
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    // Skip validation for review step
    if (!currentStep.isReviewStep) {
      const validation = validateStepData(currentStep.key, stepAnswers);
      if (!validation.success && validation.errors) {
        setErrors(validation.errors);
        return;
      }
    }

    // Show spinner
    setShowSpinner(true);

    // Save with completed = true
    const saved = await saveStep(true);

    if (!saved) {
      setShowSpinner(false);
      return;
    }
  };

  // Handle spinner complete - move to next step
  const handleSpinnerComplete = () => {
    setShowSpinner(false);
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle save and exit
  const handleSaveAndExit = async () => {
    await saveStep(false);
    // Could redirect to a "saved" page or show a message
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validate final step
    const validation = validateStepData(currentStep.key, stepAnswers);
    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    // Save final step first
    setShowSpinner(true);
    const saved = await saveStep(true);

    if (!saved) {
      setShowSpinner(false);
      return;
    }

    // Submit the session
    try {
      const response = await fetch('/api/public/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setIsSubmitted(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setShowSpinner(false);
    }
  };

  // Auto-save on blur (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Object.keys(stepAnswers).length > 0 && !isSaving && !currentStep.isReviewStep) {
        saveStep(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [stepAnswers]);

  // Navigate to step - allow navigation to any step
  const navigateToStep = async (index: number) => {
    if (index === currentStepIndex) return;

    // Save current step progress (not marked as completed) before navigating
    if (Object.keys(stepAnswers).length > 0 && !currentStep.isReviewStep) {
      await saveStep(false);
    }

    setCurrentStepIndex(index);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / onboardingSteps.length) * 100;
  const completedPercentage = (completedStepsState.length / onboardingSteps.length) * 100;

  // If submitted, show thank you screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F4F5F6]">
        {/* Header */}
        <header className="bg-[#0F1A14]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <img src={CLIXSY_LOGO_URL} alt="Clixsy" className="h-8" />
            <div className="px-4 py-2 bg-[#1A2A1F] text-white text-sm font-semibold rounded-lg">
              Clixsy Onboarding Portal
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-20">
          <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#25DC7F]/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#25DC7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0B0B0B] mb-4">
              Thank You!
            </h1>
            <p className="text-[#6B6B6B] mb-6">
              Your onboarding has been submitted successfully. We&apos;ll review your information and be in touch soon.
            </p>
            <p className="text-sm text-[#A0A0A0]">
              You can close this window now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render "Almost There" review step
  const renderAlmostThereStep = () => {
    const hasMissingFields = missingFields.length > 0;

    return (
      <div className="space-y-6">
        {hasMissingFields ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5A524]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#F5A524]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0B0B0B] mb-2">
                A few things need your attention
              </h2>
              <p className="text-[#6B6B6B]">
                Please complete the following required fields before submitting.
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(missingFieldsByStep).map(([stepKey, { stepTitle, stepIndex, fields }]) => (
                <div
                  key={stepKey}
                  className="bg-[#FEF3C7] border border-[#F5A524]/30 rounded-lg p-4 cursor-pointer hover:bg-[#FDE68A] transition-colors"
                  onClick={() => navigateToStep(stepIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#92400E] mb-1">{stepTitle}</h3>
                      <ul className="text-sm text-[#B45309]">
                        {fields.map((field) => (
                          <li key={field.fieldName} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#F5A524] rounded-full"></span>
                            {field.fieldLabel}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <svg className="w-5 h-5 text-[#92400E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#25DC7F]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#25DC7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0B0B0B] mb-2">
                All required fields are complete!
              </h2>
              <p className="text-[#6B6B6B]">
                You&apos;re ready to proceed to the final step.
              </p>
            </div>

            <div className="bg-[#ECFDF5] border border-[#25DC7F]/30 rounded-lg p-6 text-center">
              <p className="text-[#065F46] font-medium">
                Click &quot;Next&quot; to review and submit your onboarding information.
              </p>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Spinner Interstitial */}
      {showSpinner && (
        <SpinnerInterstitial
          message="Saving your progress..."
          duration={1200}
          onComplete={handleSpinnerComplete}
        />
      )}

      <div className="min-h-screen bg-[#F4F5F6] flex flex-col">
        {/* Header */}
        <header className="bg-[#0F1A14]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <img src={CLIXSY_LOGO_URL} alt="Clixsy" className="h-8" />
            <div className="px-4 py-2 bg-[#1A2A1F] text-white text-sm font-semibold rounded-lg">
              Clixsy Onboarding Portal
            </div>
          </div>

          {/* Progress Bar & Step Navigator */}
          <div className="max-w-6xl mx-auto px-6 pb-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-[#A0A0A0] mb-2">
                <span>Step {currentStepIndex + 1} of {onboardingSteps.length}</span>
                <span>{Math.round(completedPercentage)}% complete</span>
              </div>
              <div className="h-2 bg-[#1A2A1F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#25DC7F] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Step Dots Navigator */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {onboardingSteps.map((step, index) => {
                const isCompleted = completedStepsState.includes(step.key);
                const isCurrent = index === currentStepIndex;

                return (
                  <button
                    key={step.key}
                    onClick={() => navigateToStep(index)}
                    className={`group relative w-3 h-3 rounded-full transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-[#25DC7F]'
                        : isCurrent
                        ? 'bg-white ring-2 ring-[#25DC7F]'
                        : 'bg-[#569077] hover:bg-[#25DC7F]/50'
                    }`}
                    title={step.title}
                  >
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0B0B0B] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
          {/* Step Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#0B0B0B] mb-1">
              {currentStep.title}
            </h1>
            <p className="text-[#6B6B6B] text-sm">
              {currentStep.description}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E6E8EA] p-6">
            {/* Error Banner */}
            {saveError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#E5484D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#E5484D]">{saveError}</span>
                </div>
                <button
                  onClick={() => saveStep(false)}
                  className="mt-2 text-sm text-[#E5484D] hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Step Content */}
            {currentStep.isReviewStep ? (
              renderAlmostThereStep()
            ) : (
              <StepRenderer
                step={currentStep}
                values={stepAnswers}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="sticky bottom-0 bg-white border-t border-[#E6E8EA] py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStepIndex === 0
                  ? 'text-[#A0A0A0] cursor-not-allowed'
                  : 'text-[#0B0B0B] border border-[#E6E8EA] hover:bg-[#F4F5F6]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Save & Exit */}
            <button
              onClick={handleSaveAndExit}
              disabled={isSaving}
              className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#0B0B0B] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save & Exit
            </button>

            {/* Next/Submit Button */}
            {currentStepIndex === onboardingSteps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-[#25DC7F] text-white rounded-lg font-semibold hover:bg-[#1DB96A] transition-all disabled:opacity-50"
              >
                {isSaving ? 'Submitting...' : 'Submit'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-[#25DC7F] text-white rounded-lg font-semibold hover:bg-[#1DB96A] transition-all disabled:opacity-50"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}
