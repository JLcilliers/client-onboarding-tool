# Consolidation Options

## Current State
- **30 steps**, **82 questions** (62 always visible, 20 conditional)
- Estimated completion time: 20-30 minutes
- Primary pain points: too many clicks, access steps are repetitive, low-question steps feel like padding

---

## Option A — Structural Only (Conservative)

**Philosophy:** Merge steps that cover the same topic; do NOT remove any questions. Every question is preserved. Step count drops; question count stays at 82.

### Proposed Step List (18 steps)

| New Step | Title | Merges Old Steps | Questions |
|:--------:|-------|:----------------:|:---------:|
| 1 | Primary Contact | 1 | 4 |
| 2 | Additional Contacts | 2, 3 | 7 |
| 3 | Business Overview | 4, 5, 6 | 10 |
| 4 | Vision & Goals | 7, 8 | 6 |
| 5 | Brand Identity | 9, 10 | 6 |
| 6 | Domain & Website | 11, 12 | 5 |
| 7 | Lead Tracking | 13 | 3 |
| 8 | Target Areas | 14 | 3 |
| 9 | Case Types & Keywords | 15 | 3 |
| 10 | Google Business Profile | 16 | 4 |
| 11 | Legal & Compliance | 17 | 3 |
| 12 | Content Preferences | 18 | 3 |
| 13 | Communication | 19 | 3 |
| 14 | Access Checklist | 20-26 | 11 |
| 15 | Previous Agency | 27 | 3 |
| 16 | Welcome Gift | 28 | 4 |
| 17 | Review | 29 | 0* |
| 18 | Submit | 30 | 3 |

### Summary

| Metric | Before | After | Change |
|--------|:------:|:-----:|:------:|
| Steps | 30 | 18 | -40% |
| Questions | 82 | 82 | 0% |
| Required | 11 | 11 | 0% |
| Estimated time | 25 min | 18 min | -28% |

**Pros:** Zero information loss. No stakeholder debate about removed questions. Reduces click fatigue immediately.

**Cons:** The form is still long in question count. Clients still see 82 fields.

**Risk:** Low. Purely structural change.

---

## Option B — Balanced (Recommended)

**Philosophy:** Merge steps AND remove/defer low-value questions. Keep everything the business needs for kickoff; move "nice to know" items to a post-onboarding follow-up. Access steps become a single checklist.

### Decision Criteria for Removal/Deferral
- **Keep:** Required fields, questions that block project kickoff, questions with no other source
- **Defer:** Questions the agency can answer itself (e.g., review count, star rating — visible on GBP), questions that rarely change the engagement plan
- **Remove:** Redundant or meta-only fields

### Proposed Step List (12 steps)

| New Step | Title | Sources | Always Visible | Conditional | Total |
|:--------:|-------|---------|:-:|:-:|:-:|
| 1 | Primary Contact | Old 1 | 4 | 0 | 4 |
| 2 | Other Contacts | Old 2, 3 | 2 | 5 | 7 |
| 3 | Business Overview | Old 4, 5, 6 | 6 | 0 | 6 |
| 4 | Goals & Strategy | Old 7, 8 | 4 | 0 | 4 |
| 5 | Brand & Design | Old 9, 10 | 3 | 2 | 5 |
| 6 | Technical Setup | Old 11, 12, 13 | 5 | 1 | 6 |
| 7 | SEO & Targeting | Old 14, 15, 16 | 5 | 3 | 8 |
| 8 | Legal, Content & Comms | Old 17, 18, 19 | 6 | 1 | 7 |
| 9 | Access Checklist | Old 20-26 | 8 | 2 | 10 |
| 10 | Transition & Wrap-up | Old 27, 28 | 2 | 5 | 7 |
| 11 | Review | Old 29 | 0 | 0 | 0 |
| 12 | Submit | Old 30 | 3 | 0 | 3 |

### Questions Removed/Deferred (15 questions)

| Old Step | Field Key | Question | Action | Rationale |
|:--------:|-----------|----------|--------|-----------|
| 4 | year_founded | When was your firm founded? | Defer | Nice-to-know; doesn't affect service delivery |
| 5 | location_type | What type of location is this? | Remove | Irrelevant to marketing services |
| 5 | how_long_at_location | How long at this location? | Remove | Irrelevant to marketing services |
| 6 | firm_size | How many people work at your firm? | Defer | Discovery call context, not onboarding-critical |
| 8 | current_lead_volume | How many leads per month? | Defer | Better gathered in kickoff call with context |
| 8 | target_lead_volume | Target leads per month? | Defer | Better gathered in kickoff call with context |
| 9 | has_logo_files | Do you have high-quality logo files? | Remove | Agency will request files directly |
| 10 | typography_fonts | What fonts do you use? | Defer | Agency can extract from website |
| 14 | has_multiple_locations | Multiple office locations? | Remove | Already captured by service_area_type + address |
| 16 | current_review_count | How many Google reviews? | Remove | Agency can see this on GBP directly |
| 16 | current_rating | Current star rating? | Remove | Agency can see this on GBP directly |
| 19 | additional_report_recipients | Who else should receive reports? | Defer | Can be set up any time post-kickoff |
| 26 | has_lsa | Do you have LSA? | Defer | Niche; ask during strategy call |
| 26 | lsa_customer_ids | LSA Customer ID(s) | Defer | Niche; ask during strategy call |
| 28 | shipping_preference | Shipping instructions? | Remove | Rarely used; handle via email if gift accepted |

### Summary

| Metric | Before | After | Change |
|--------|:------:|:-----:|:------:|
| Steps | 30 | 12 | -60% |
| Questions | 82 | 67 | -18% |
| Required | 11 | 11 | 0% |
| Estimated time | 25 min | 12 min | -52% |

**Pros:** Dramatic reduction in perceived length. All kickoff-critical info preserved. Deferred items have a clear follow-up path. Access checklist eliminates 7 repetitive steps.

**Cons:** 15 questions moved or removed — requires stakeholder sign-off. Deferred items need a follow-up process.

**Risk:** Medium-low. No required fields affected. Deferred items are all optional and have alternative collection paths.

---

## Option C — Aggressive (Minimum Viable Onboarding)

**Philosophy:** Onboarding captures ONLY what is needed to start work. Everything else is gathered during kickoff call or first 30 days. Goal: client completes in under 8 minutes.

### Proposed Step List (7 steps)

| New Step | Title | Always Visible | Conditional | Total |
|:--------:|-------|:-:|:-:|:-:|
| 1 | Contact Info | 4 | 5 | 9 |
| 2 | Business Basics | 4 | 0 | 4 |
| 3 | Goals | 2 | 0 | 2 |
| 4 | SEO Targeting | 3 | 0 | 3 |
| 5 | Access Checklist | 8 | 1 | 9 |
| 6 | Legal & Content | 3 | 1 | 4 |
| 7 | Submit | 3 | 0 | 3 |

### Questions Removed/Deferred (48 questions)

All Brand & Design, Success Metrics details, Communication preferences, Welcome Gift, Previous Agency, and most conditional fields are deferred to post-onboarding. Only contact info, business essentials, core goals, SEO targeting, access provisioning, and legal compliance remain.

### Summary

| Metric | Before | After | Change |
|--------|:------:|:-----:|:------:|
| Steps | 30 | 7 | -77% |
| Questions | 82 | 34 | -59% |
| Required | 11 | 11 | 0% |
| Estimated time | 25 min | 6 min | -76% |

**Pros:** Fastest possible onboarding. Eliminates all friction. Client is "done" in minutes.

**Cons:** Heavy reliance on post-onboarding follow-up. Team must have a structured process to collect missing info. Higher risk of info gaps at project start.

**Risk:** Medium-high. Requires operational changes to compensate for deferred questions.

---

## Comparison Matrix

| Dimension | Current | Option A | Option B (Rec.) | Option C |
|-----------|:-------:|:--------:|:---------------:|:--------:|
| Steps | 30 | 18 | 12 | 7 |
| Questions | 82 | 82 | 67 | 34 |
| Required fields | 11 | 11 | 11 | 11 |
| Estimated time | 25 min | 18 min | 12 min | 6 min |
| Questions removed | 0 | 0 | 7 | 36 |
| Questions deferred | 0 | 0 | 8 | 12 |
| Dev effort | — | Low | Medium | Medium-High |
| Process change needed | — | None | Follow-up list | Significant |
| Information loss risk | — | None | None | Low-Med |

## Recommendation

**Option B (Balanced)** is recommended because it:
1. Cuts the step count by 60% (30 → 12) — the most impactful change for perceived length
2. Preserves all 11 required fields and all kickoff-critical information
3. Only removes questions the agency can self-serve (GBP ratings, logo files) or that are irrelevant (location type)
4. Defers questions to kickoff calls where they get better answers with context
5. Consolidates access provisioning into one clear checklist — the biggest structural win
6. Requires moderate dev effort with no operational process overhaul
