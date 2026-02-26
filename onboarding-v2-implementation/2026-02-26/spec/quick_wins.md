# Quick Wins

The 10 fastest changes to reduce perceived onboarding length, ranked by impact-to-effort ratio. These can be implemented independently of the full consolidation plan.

---

## 1. Merge Access Steps 20-26 into a Single Checklist
**Impact:** High | **Effort:** Medium | **Steps saved:** 6

Replace 7 near-identical "grant access" pages with one checklist table (see `access_checklist_redesign.md`). This single change reduces the step count from 30 to 24 — the biggest structural win available.

**Before:** 7 pages, 7 "Next" clicks, same radio pattern repeated
**After:** 1 page, scannable table, all access items visible at once

---

## 2. Merge Steps 2 + 3 (Additional + Technical Contacts)
**Impact:** Medium | **Effort:** Low | **Steps saved:** 1

Both steps ask "Do you have another contact?" with conditional fields. Combine into one "Other Contacts" step with two sections: "Day-to-day contact" and "Technical/IT contact."

---

## 3. Merge Steps 4 + 5 + 6 (Business Basics + Location + Details)
**Impact:** Medium | **Effort:** Low | **Steps saved:** 2

These three steps cover closely related business information (name, URL, phone, address, language, size). Combined, they total 10 questions — a reasonable single-page form. Group with clear section headers.

---

## 4. Merge Steps 7 + 8 (Vision & Goals + Success Metrics)
**Impact:** Medium | **Effort:** Low | **Steps saved:** 1

Both steps cover goals and success measurement. Together they have only 6 questions. Natural single-page grouping.

---

## 5. Merge Steps 9 + 10 (Brand Assets + Colors & Fonts)
**Impact:** Low-Medium | **Effort:** Low | **Steps saved:** 1

Brand identity is one topic across two steps with 6 total questions. Merge into "Brand Identity."

---

## 6. Show Progress as Percentage, Not "Step X of 30"
**Impact:** Medium | **Effort:** Very Low | **Steps saved:** 0 (perception change)

"Step 14 of 30" is demoralizing. "47% complete" feels more encouraging. Better yet: show a smooth progress bar based on questions answered (not steps visited).

---

## 7. Add "Required" Badges and Visual Hierarchy
**Impact:** Medium | **Effort:** Very Low | **Steps saved:** 0 (perception change)

Only 11 of 82 fields are required, but nothing visually distinguishes them. Add a red asterisk or "Required" badge to required fields and style optional fields with lighter labels. This lets clients focus on what matters and skip the rest.

---

## 8. Add a "Skip Optional" Button
**Impact:** Medium | **Effort:** Low | **Steps saved:** 0 (behavior change)

For steps with zero required fields (most of them), add a "Skip for now" link next to the "Next" button. This preserves all questions but lets clients who want speed skip sections they can't answer yet.

---

## 9. Remove Step 29 (Almost There!) or Merge with Step 30
**Impact:** Low | **Effort:** Very Low | **Steps saved:** 1

Step 29 shows validation warnings but has no inputs. It's an extra click before submission. Either embed the validation summary at the top of Step 30 or show it inline as users navigate.

---

## 10. Remove Questions the Agency Can Self-Serve
**Impact:** Low-Medium | **Effort:** Very Low | **Steps saved:** 0 (question reduction)

These fields can be answered by the agency without asking the client:

| Field | Step | Why Remove |
|-------|:----:|------------|
| current_review_count | 16 | Visible on Google Business Profile |
| current_rating | 16 | Visible on Google Business Profile |
| has_logo_files | 9 | Agency will request files directly in onboarding email |
| has_multiple_locations | 14 | Already captured via service_area_type + address |

Removing 4 questions that the agency can answer itself reduces client effort without losing any information.

---

## Implementation Priority

| Priority | Win # | Description | Steps Saved | Dev Time |
|:--------:|:-----:|-------------|:-----------:|:--------:|
| P0 | 1 | Access checklist merge | 6 | 1-2 days |
| P0 | 6 | Progress as percentage | 0 | 1 hour |
| P0 | 7 | Required field badges | 0 | 1 hour |
| P1 | 3 | Merge business steps | 2 | 0.5 day |
| P1 | 2 | Merge contact steps | 1 | 0.5 day |
| P1 | 4 | Merge goals steps | 1 | 0.5 day |
| P1 | 9 | Remove/merge step 29 | 1 | 1 hour |
| P2 | 5 | Merge brand steps | 1 | 0.5 day |
| P2 | 8 | Skip optional button | 0 | 0.5 day |
| P2 | 10 | Remove self-serve questions | 0 | 1 hour |

**Combined effect of all 10 wins:** 30 steps → 18 steps, better visual hierarchy, faster perceived completion.
