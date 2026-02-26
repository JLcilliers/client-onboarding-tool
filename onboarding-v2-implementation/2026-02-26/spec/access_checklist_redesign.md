# Access Checklist Redesign

## Problem Statement

Steps 20-26 currently occupy **7 separate steps** in the onboarding flow but contain only **11 questions** — an average of 1.6 questions per step. Five of these steps (21-25) have exactly one radio question each. The user must click "Next" seven times to complete what is essentially a single checklist task.

All seven steps follow the same pattern:
1. Ask if the client has the service
2. Ask if access has been granted (with nearly identical radio options)

## Current State (Steps 20-26)

| Step | Service | Questions | Pattern |
|:----:|---------|:---------:|---------|
| 20 | Google Analytics | 2 | "Do you have GA?" → if Yes: "Have you granted access?" |
| 21 | Google Search Console | 1 | "Have you granted GSC access?" |
| 22 | Google Business Profile | 1 | "Have you granted GBP access?" |
| 23 | WordPress | 1 | "Have you created a WP user?" |
| 24 | Domain Registrar | 1 | "Have you granted domain access?" |
| 25 | Cloudflare / DNS | 1 | "Have you granted DNS access?" |
| 26 | Other (YouTube, LSA) | 4 | "Have YouTube?" → "Granted access?" + "Have LSA?" → "Customer ID?" |

**Total: 7 steps, 11 questions, 7 page navigations.**

## Proposed Design: Single "Access Checklist" Step

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Step 9 of 12: Access Checklist                             │
│  ─────────────────────────────────────────────────────────── │
│  Please grant Clixsy access to the following accounts.      │
│  You can come back and update these later.                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ SERVICE               │ STATUS           │ ACTION       ││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ Google Analytics       │ [dropdown ▼]     │ Add          ││
│  │                        │                  │ tempclixsy...││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ Google Search Console  │ [dropdown ▼]     │ Add          ││
│  │                        │                  │ tempclixsy...││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ Google Business Profile│ [dropdown ▼]     │ Add          ││
│  │                        │                  │ tempclixsy...││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ WordPress Admin        │ [dropdown ▼]     │ Create user  ││
│  │                        │                  │ keith@clix...││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ Domain Registrar       │ [dropdown ▼]     │ Grant access ││
│  │                        │                  │ corey@clix...││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ Cloudflare / DNS       │ [dropdown ▼]     │ Add          ││
│  │                        │                  │ tempclixsy...││
│  ├───────────────────────┼──────────────────┼──────────────┤│
│  │ YouTube (optional)     │ [dropdown ▼]     │ Add          ││
│  │                        │                  │ tempclixsy...││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ☐ Do you have Google Analytics set up?                     │
│     (If No, we'll set it up for you)                        │
│                                                             │
│           [ ← Back ]                    [ Next → ]          │
└─────────────────────────────────────────────────────────────┘
```

### Dropdown Options (standardized across all rows)

Each service row has a status dropdown with these options:

| Option | Meaning |
|--------|---------|
| Done — access granted | Client has completed the action |
| I'll do this later | Acknowledged but deferred |
| I need help | Client doesn't know how |
| Not applicable | Service not used / not relevant |

### Field Mapping (Old → New)

| Old Field Key | Old Step | New Checklist Row | Dropdown Value Mapping |
|---------------|:--------:|-------------------|----------------------|
| has_google_analytics | 20 | *(becomes gate: show GA row only if "Yes")* | — |
| ga_access_granted | 20 | Google Analytics | Direct map |
| gsc_access_granted | 21 | Google Search Console | Direct map |
| gbp_access_granted | 22 | Google Business Profile | Direct map |
| wordpress_access_granted | 23 | WordPress Admin | Direct map |
| domain_registrar_access_status | 24 | Domain Registrar | Direct map |
| dns_access_granted | 25 | Cloudflare / DNS | Direct map |
| has_youtube | 26 | *(becomes gate: show YouTube row only if "Yes")* | — |
| youtube_access_granted | 26 | YouTube | Direct map |
| has_lsa | 26 | **Deferred** (Option B) | — |
| lsa_customer_ids | 26 | **Deferred** (Option B) | — |

### Conditional Logic

1. **Google Analytics row** appears only if `has_google_analytics = Yes` (checkbox at bottom of step)
2. **YouTube row** appears only if client has a YouTube channel (small toggle or auto-detect from step 16 GBP URL domain)
3. All other rows are always visible with "Not applicable" as an option

### Data Model

```
access_checklist: {
  has_google_analytics: boolean,
  ga_access_status: "done" | "later" | "help" | "na",
  gsc_access_status: "done" | "later" | "help" | "na",
  gbp_access_status: "done" | "later" | "help" | "na",
  wordpress_access_status: "done" | "later" | "help" | "na",
  domain_access_status: "done" | "later" | "help" | "na",
  dns_access_status: "done" | "later" | "help" | "na",
  has_youtube: boolean,
  youtube_access_status: "done" | "later" | "help" | "na"
}
```

### Benefits

| Metric | Before (Steps 20-26) | After (1 Step) |
|--------|:--------------------:|:--------------:|
| Steps | 7 | 1 |
| Page navigations | 7 | 1 |
| Questions | 11 | 10 (LSA deferred) |
| Avg completion time | ~5 min | ~1.5 min |
| Visual pattern | Repetitive pages | Scannable table |

### Implementation Notes

1. **Backward compatibility:** Map new field keys to old ones for any downstream integrations that consume the onboarding data.
2. **Auto-save:** Each dropdown change should auto-save individually (same as current behavior).
3. **Progress indicator:** The checklist counts as 1 step toward total. Consider showing "X of Y access items completed" within the step itself.
4. **Mobile:** On mobile, the table should stack into cards (one per service) rather than a horizontal table.
5. **Admin view:** The admin session detail page should show the access checklist as a summary grid rather than 7 separate sections.

### Migration Path

If Option A is chosen, the 7 steps merge into 1 step with no question removal — include LSA rows in the checklist.

If Option B is chosen, the 7 steps merge into 1 step and LSA questions are deferred to the strategy call.

If Option C is chosen, the access checklist is further simplified: only show GA, GSC, GBP, WordPress, and DNS (5 rows). Domain registrar and YouTube are deferred.
