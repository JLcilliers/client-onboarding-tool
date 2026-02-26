import { onboardingSteps, validateStepData, getMissingRequiredFields } from './steps';
import { onboardingStepsV2, validateStepDataV2, getMissingRequiredFieldsV2 } from './steps-v2';
import type { OnboardingStep } from './steps';

export type FlowVersion = 'v1' | 'v2';

export function getStepsForVersion(v: FlowVersion | string): OnboardingStep[] {
  return v === 'v2' ? onboardingStepsV2 : onboardingSteps;
}

export function validateStepDataForVersion(
  v: FlowVersion | string,
  stepKey: string,
  data: Record<string, unknown>
): { success: boolean; errors?: Record<string, string> } {
  return v === 'v2'
    ? validateStepDataV2(stepKey, data)
    : validateStepData(stepKey, data);
}

export function getMissingRequiredFieldsForVersion(
  v: FlowVersion | string,
  answers: Record<string, Record<string, unknown>>
): { stepKey: string; stepTitle: string; stepIndex: number; fieldName: string; fieldLabel: string }[] {
  return v === 'v2'
    ? getMissingRequiredFieldsV2(answers)
    : getMissingRequiredFields(answers);
}
