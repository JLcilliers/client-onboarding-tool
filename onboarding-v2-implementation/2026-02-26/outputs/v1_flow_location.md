# v1 Flow Location

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/onboarding/steps.ts` | v1 step definitions (30 steps, 82 questions) |
| `src/lib/onboarding/accessChecklist.ts` | v1 access checklist logic |
| `src/lib/supabase/server.ts` | Database types and helpers |
| `src/components/onboarding/Wizard.tsx` | Client-facing wizard UI |
| `src/components/onboarding/StepRenderer.tsx` | Form field renderer |
| `src/app/onboarding/[token]/page.tsx` | Client entry point |
| `src/app/api/public/onboarding/session/route.ts` | Session API |
| `src/app/api/public/onboarding/save-step/route.ts` | Save step API |
| `src/app/api/public/onboarding/submit/route.ts` | Submit API |
| `src/app/api/admin/onboarding/create/route.ts` | Create session API |
| `src/app/api/admin/onboarding/sessions/route.ts` | Sessions list API |
| `src/app/api/admin/onboarding/sessions/[id]/route.ts` | Session detail API |
| `src/app/admin/onboarding/sessions/[id]/page.tsx` | Admin session detail page |

## v1 Summary

- **30 steps**, 82 questions (62 always visible, 20 conditional, 11 required)
- Steps 20-26 are 7 individual access provisioning steps with 11 questions
- `steps.ts` exports: `onboardingSteps`, `validateStepData()`, `getMissingRequiredFields()`, `getStepIndex()`
- No `flow_version` column exists yet in `onboarding_sessions` table
- Bug: `sessions/route.ts` line 5 has `const TOTAL_STEPS = 12` (should be 30 for v1)
