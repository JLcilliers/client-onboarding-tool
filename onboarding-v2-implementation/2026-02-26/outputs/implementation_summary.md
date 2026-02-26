# Onboarding v2 Implementation Summary

## What Changed

### New Files (6)

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/onboarding/steps-v2.ts` | ~580 | 12-step v2 configuration with Zod validation |
| `src/lib/onboarding/flow-version.ts` | ~30 | Version dispatcher (single import point) |
| `src/lib/onboarding/accessChecklist-v2.ts` | ~70 | v2 access checklist computation |
| `src/lib/onboarding/adapters.ts` | ~80 | v1↔v2 answer normalization |
| `src/components/onboarding/AccessChecklistStep.tsx` | ~190 | Checklist table UI (desktop table + mobile cards) |
| `supabase/migrations/002_add_flow_version.sql` | 1 | Database migration |

### Modified Files (10)

| File | Changes |
|------|---------|
| `src/lib/supabase/server.ts` | Added `flow_version: 'v1' \| 'v2'` to `OnboardingSession` |
| `src/app/api/admin/onboarding/create/route.ts` | New sessions default to `flow_version: 'v2'` |
| `src/app/api/public/onboarding/session/route.ts` | Returns version-aware steps + `flowVersion` |
| `src/app/api/public/onboarding/save-step/route.ts` | Version-aware validation |
| `src/app/api/public/onboarding/submit/route.ts` | Version-aware required steps + total |
| `src/app/api/admin/onboarding/sessions/route.ts` | Fixed TOTAL_STEPS bug, version-aware progress |
| `src/app/api/admin/onboarding/sessions/[id]/route.ts` | Version-aware checklist + includes flow_version |
| `src/components/onboarding/Wizard.tsx` | Accepts `flowVersion` prop, dynamic steps array |
| `src/app/onboarding/[token]/page.tsx` | Passes `flowVersion` to Wizard |
| `src/app/admin/onboarding/sessions/[id]/page.tsx` | Version-aware step rendering |

### Unchanged Files

| File | Reason |
|------|--------|
| `src/lib/onboarding/steps.ts` | v1 config preserved — backward compatibility |
| `src/lib/onboarding/accessChecklist.ts` | v1 logic preserved |
| `src/components/onboarding/StepRenderer.tsx` | Reused as-is for all non-checklist steps |
| `src/components/onboarding/SpinnerInterstitial.tsx` | No changes needed |

## Bug Fix

Fixed `src/app/api/admin/onboarding/sessions/route.ts` which had `const TOTAL_STEPS = 12` hardcoded — now computes per-session based on `flow_version`.

## Verification Results

- `npx tsc --noEmit` — **PASS** (0 errors)
- `npm run lint` — **PASS** (0 errors, 14 pre-existing warnings)
- `onboardingStepsV2.length === 12` — **PASS**

## v2 Flow (12 steps)

1. Primary Contact (4 fields, 4 required)
2. Other Contacts (7 fields, 5 conditional)
3. Business Overview (6 fields, 4 required)
4. Goals & Strategy (4 fields, 1 required)
5. Brand & Design (5 fields, 2 conditional)
6. Technical Setup (8 fields, 1 conditional)
7. SEO & Targeting (7 fields, 2 required, 1 conditional)
8. Legal, Content & Communication (8 fields, 1 conditional)
9. Access Checklist (9 fields, 2 conditional) — custom component
10. Transition & Wrap-up (6 fields, 4 conditional)
11. Review (0 fields, isReviewStep)
12. Submit (3 fields)

**Total:** 66 questions, 11 required
