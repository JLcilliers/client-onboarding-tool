'use client';

import { useState, useEffect, useCallback } from 'react';
import { onboardingSteps, validateStepData, OnboardingStep } from '@/lib/onboarding/steps';
import StepRenderer from './StepRenderer';
import SpinnerInterstitial from './SpinnerInterstitial';

interface WizardProps {
  token: string;
  initialStep: number;
  initialAnswers: Record<string, { answers: Record<string, unknown>; completed: boolean }>;
  logoUrl?: string | null;
  sessionStatus: 'draft' | 'in_progress' | 'submitted';
}

export default function Wizard({
  token,
  initialStep,
  initialAnswers,
  logoUrl,
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(sessionStatus === 'submitted');

  const currentStep = onboardingSteps[currentStepIndex];
  const stepAnswers = answers[currentStep?.key] || {};

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
    // Validate current step
    const validation = validateStepData(currentStep.key, stepAnswers);
    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
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
      if (Object.keys(stepAnswers).length > 0 && !isSaving) {
        saveStep(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [stepAnswers]);

  // If submitted, show thank you screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="w-20 h-20 mx-auto mb-6 object-contain" />
          )}
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your onboarding has been submitted successfully. We&apos;ll review your information and be in touch soon.
          </p>
          <p className="text-sm text-gray-500">
            You can close this window now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Spinner Interstitial */}
      {showSpinner && (
        <SpinnerInterstitial
          logoUrl={logoUrl}
          message="Saving your progress..."
          duration={1200}
          onComplete={handleSpinnerComplete}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            )}
            <div className="flex items-center gap-4">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleSaveAndExit}
                disabled={isSaving}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStepIndex + 1} of {onboardingSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStepIndex + 1) / onboardingSteps.length) * 100)}% complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex justify-between mt-3 overflow-x-auto">
              {onboardingSteps.map((step, index) => (
                <button
                  key={step.key}
                  onClick={() => {
                    if (index < currentStepIndex) {
                      setCurrentStepIndex(index);
                    }
                  }}
                  disabled={index > currentStepIndex}
                  className={`text-xs px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    index === currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : index < currentStepIndex
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-pointer hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Error Banner */}
            {saveError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 dark:text-red-300">{saveError}</span>
                </div>
                <button
                  onClick={() => saveStep(false)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Step Content */}
            {currentStep && (
              <StepRenderer
                step={currentStep}
                values={stepAnswers}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStepIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Previous
              </button>

              {currentStepIndex === onboardingSteps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Submitting...' : 'Submit Onboarding'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isSaving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Continue'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
