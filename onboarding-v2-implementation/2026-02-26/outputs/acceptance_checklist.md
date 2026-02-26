# Acceptance Checklist

## Automated Checks

| Check | Status |
|-------|--------|
| `npx tsc --noEmit` — no type errors | PASS |
| `npm run lint` — no new errors | PASS |
| `onboardingStepsV2.length === 12` | PASS |

## Manual Smoke Tests (To Be Verified)

| # | Test | Expected | Status |
|---|------|----------|--------|
| 1 | New session (v2): Create via admin | Opens 12-step wizard | PENDING |
| 2 | Walk through all 12 v2 steps | All render correctly | PENDING |
| 3 | Access Checklist: Toggle GA/YouTube radios | Rows show/hide correctly | PENDING |
| 4 | Access Checklist: Set statuses | Auto-saves, dropdown colors update | PENDING |
| 5 | Required fields: Skip required fields | Review step shows missing | PENDING |
| 6 | Submit v2 session | Thank you screen, status = submitted | PENDING |
| 7 | v1 regression: Open existing v1 session | 30 steps, all data intact | PENDING |
| 8 | Admin list: Both v1 and v2 sessions | Correct progress percentages | PENDING |
| 9 | Admin detail: v1 session | Renders with v1 access checklist | PENDING |
| 10 | Admin detail: v2 session | Renders with v2 access checklist | PENDING |

## Database Migration

- [ ] Run `supabase/migrations/002_add_flow_version.sql` on Supabase dashboard
- [ ] Verify existing sessions have `flow_version = 'v1'` (default)
- [ ] Verify new sessions get `flow_version = 'v2'`
