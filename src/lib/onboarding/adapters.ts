// =============================================
// ADAPTERS: Normalize v1 and v2 answers to canonical format
// =============================================
// Used for cross-version reporting and data export

import type { FlowVersion } from './flow-version';

type AnswersByStep = Record<string, Record<string, unknown>>;

// v1 access field → canonical field mapping
const V1_ACCESS_MAPPING: {
  v1StepKey: string;
  v1Field: string;
  canonicalField: string;
}[] = [
  { v1StepKey: 'google_access', v1Field: 'ga_access_granted', canonicalField: 'ga_access_status' },
  { v1StepKey: 'google_access', v1Field: 'gsc_access_granted', canonicalField: 'gsc_access_status' },
  { v1StepKey: 'google_access', v1Field: 'gbp_access_granted', canonicalField: 'gbp_access_status' },
  { v1StepKey: 'website_access', v1Field: 'wordpress_access_granted', canonicalField: 'wordpress_access_status' },
  { v1StepKey: 'website_access', v1Field: 'domain_registrar_access', canonicalField: 'domain_access_status' },
  { v1StepKey: 'website_access', v1Field: 'dns_access_granted', canonicalField: 'dns_access_status' },
  { v1StepKey: 'other_access', v1Field: 'youtube_access_granted', canonicalField: 'youtube_access_status' },
];

function mapV1AccessValue(value: unknown): string {
  if (value === 'granted' || value === 'will_do') return 'done';
  if (value === 'will_share_login') return 'done';
  if (value === 'not_setup' || value === 'no_gbp' || value === 'not_wordpress') return 'not_applicable';
  if (typeof value === 'string' && value) return 'later';
  return '';
}

export function normalizeV1AnswersToCanonical(answersByStep: AnswersByStep): Record<string, unknown> {
  const flat: Record<string, unknown> = {};

  // Flatten all step answers
  for (const [, stepAnswers] of Object.entries(answersByStep)) {
    for (const [key, value] of Object.entries(stepAnswers)) {
      flat[key] = value;
    }
  }

  // Map v1 access fields to canonical
  for (const mapping of V1_ACCESS_MAPPING) {
    const stepAnswers = answersByStep[mapping.v1StepKey];
    if (stepAnswers && stepAnswers[mapping.v1Field] !== undefined) {
      flat[mapping.canonicalField] = mapV1AccessValue(stepAnswers[mapping.v1Field]);
    }
  }

  return flat;
}

export function normalizeV2AnswersToCanonical(answersByStep: AnswersByStep): Record<string, unknown> {
  const flat: Record<string, unknown> = {};

  // v2 answers are already in canonical format, just flatten
  for (const [, stepAnswers] of Object.entries(answersByStep)) {
    for (const [key, value] of Object.entries(stepAnswers)) {
      flat[key] = value;
    }
  }

  return flat;
}

export function normalizeAnswers(
  version: FlowVersion | string,
  answersByStep: AnswersByStep
): Record<string, unknown> {
  return version === 'v2'
    ? normalizeV2AnswersToCanonical(answersByStep)
    : normalizeV1AnswersToCanonical(answersByStep);
}
