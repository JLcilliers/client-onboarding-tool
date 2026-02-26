# Proposed Flow v2 Spec (Option B — Balanced)

## Overview

This document is a developer-ready specification for the consolidated onboarding flow. It maps every field from the current 30-step flow to the new 12-step flow, including field keys, input types, conditional logic, and required status.

**Target:** 12 steps, 67 questions (52 always visible, 15 conditional), 11 required fields.

---

## Step 1: Primary Contact

**Subtitle:** Who is the main decision maker for this project?
**Source:** Old Step 1

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | main_contact_name | Full Name | text | Yes | — | — |
| 2 | main_contact_title | Title/Role | select | Yes | — | Owner / Managing Partner, Partner, Marketing Director, Office Manager, Other |
| 3 | main_contact_email | Email Address | email | Yes | — | — |
| 4 | main_contact_phone | Best Contact Number | tel | Yes | — | — |

**Always visible:** 4 | **Conditional:** 0 | **Total:** 4

---

## Step 2: Other Contacts

**Subtitle:** Who else should we contact for day-to-day or technical matters?
**Source:** Old Steps 2, 3

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | has_secondary_contact | Do you have a secondary contact? | radio | No | — | Yes · No, primary handles everything |
| 2 | secondary_contact_name | Secondary Contact - Full Name | text | No | has_secondary_contact = Yes | — |
| 3 | secondary_contact_email | Secondary Contact - Email | text | No | has_secondary_contact = Yes | — |
| 4 | secondary_contact_phone | Secondary Contact - Phone | text | No | has_secondary_contact = Yes | — |
| 5 | has_tech_contact | Do you have a technical/IT contact? | radio | No | — | Yes, dedicated IT · Yes, external IT company · No, primary handles IT |
| 6 | tech_contact_name | Technical Contact - Full Name | text | No | has_tech_contact = Yes (either) | — |
| 7 | tech_contact_email | Technical Contact - Email | email | No | has_tech_contact = Yes (either) | — |

**Always visible:** 2 | **Conditional:** 5 | **Total:** 7

---

## Step 3: Business Overview

**Subtitle:** Tell us about your business.
**Source:** Old Steps 4, 5, 6 (minus location_type, how_long_at_location, firm_size)

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | business_name | Business Name | text | Yes | — | — |
| 2 | website_url | Main Website URL | url | Yes | — | — |
| 3 | business_phone | Main Business Phone | tel | Yes | — | — |
| 4 | physical_address | Physical Company Address | textarea | Yes | — | — |
| 5 | languages | Languages spoken at your firm | checkbox-group | No | — | English, Spanish, Chinese, Vietnamese, Korean, Tagalog, Other |
| 6 | owner_names | Owner/Main Partner(s) Names | textarea | No | — | — |

**Removed from old flow:**
- `year_founded` → Deferred to kickoff call
- `location_type` → Removed (irrelevant to marketing)
- `how_long_at_location` → Removed (irrelevant to marketing)
- `firm_size` → Deferred to kickoff call

**Always visible:** 6 | **Conditional:** 0 | **Total:** 6

---

## Step 4: Goals & Strategy

**Subtitle:** Help us understand what success looks like.
**Source:** Old Steps 7, 8 (minus current_lead_volume, target_lead_volume)

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | primary_goal | What is your #1 goal? | radio | No | — | Get more leads, Better quality leads, Brand awareness, Stay competitive, All of the above |
| 2 | success_definition | What would make this a success in 12 months? | textarea | Yes | — | — |
| 3 | current_challenges | Biggest marketing challenge? | textarea | No | — | — |
| 4 | important_metrics | Which metrics matter most? | checkbox-group | No | — | Website traffic, Phone calls, Form submissions, Signed clients, Rankings, Reviews, Revenue |

**Removed from old flow:**
- `current_lead_volume` → Deferred (better gathered in kickoff with context)
- `target_lead_volume` → Deferred (better gathered in kickoff with context)

**Always visible:** 4 | **Conditional:** 0 | **Total:** 4

---

## Step 5: Brand & Design

**Subtitle:** Help us maintain your visual identity.
**Source:** Old Steps 9, 10 (minus has_logo_files, typography_fonts)

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | has_brand_guide | Do you have a brand style guide? | radio | No | — | Yes · Some guidelines · No |
| 2 | knows_brand_colors | Do you know your brand color hex codes? | radio | No | — | Yes, I know them · No, pull from website |
| 3 | primary_color | Primary Brand Color (Hex) | text | No | knows_brand_colors = Yes | — |
| 4 | secondary_color | Secondary Brand Color (Hex) | text | No | knows_brand_colors = Yes | — |
| 5 | typography_fonts | What fonts do you use? | text | No | — | — |

**Note:** typography_fonts was initially considered for deferral. Including it here as it's a simple text field that some brand-conscious clients want to provide. Stakeholders may choose to defer — see decision worksheet.

**Removed from old flow:**
- `has_logo_files` → Removed (agency requests files directly)

**Always visible:** 3 | **Conditional:** 2 | **Total:** 5

---

## Step 6: Technical Setup

**Subtitle:** Tell us about your website and tracking setup.
**Source:** Old Steps 11, 12, 13

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | owns_domain | Do you own your domain? | radio | No | — | Yes · No · Not sure |
| 2 | domain_registrar | Where is your domain registered? | select | No | — | GoDaddy, Namecheap, Google Domains, Cloudflare, Network Solutions, Other |
| 3 | controls_dns | Access to DNS settings? | radio | No | — | Yes · No · Not sure |
| 4 | website_platform | Website platform? | radio | No | — | WordPress, Squarespace, Wix, Webflow, Custom, Not sure |
| 5 | website_managed_by | Who manages your website? | radio | No | — | Internal, Another agency, Freelancer, No one |
| 6 | uses_call_tracking | Do you use call tracking? | radio | No | — | Yes · No · Not sure |
| 7 | call_tracking_provider | Which provider? | select | No | uses_call_tracking = Yes | CallRail, CTM, Marchex, Other |
| 8 | form_submission_destinations | Where should form submissions go? | textarea | No | — | — |

**Note:** `form_submission_destinations` was originally at the end of Lead Tracking (Step 13). Including it here since it's always visible and relevant to technical setup.

**Always visible:** 6 (owns_domain, domain_registrar, controls_dns, website_platform, website_managed_by, uses_call_tracking) + form_submission_destinations = 7. Wait — let me recount. uses_call_tracking is always visible, call_tracking_provider is conditional, form_submission_destinations is always visible. That's 7 always visible + 1 conditional = 8 total. Let me correct the step summary.

**Always visible:** 7 | **Conditional:** 1 | **Total:** 8

---

## Step 7: SEO & Targeting

**Subtitle:** Where do you want to be found and for what?
**Source:** Old Steps 14, 15, 16 (minus has_multiple_locations, current_review_count, current_rating)

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | service_area_type | Service area? | radio | No | — | Local, Regional, Statewide, National |
| 2 | main_geographical_areas | Target cities/areas | textarea | Yes | — | — |
| 3 | primary_case_types_keywords | Primary case types | textarea | Yes | — | — |
| 4 | case_priority | Focus case type first? | text | No | — | — |
| 5 | cases_to_avoid | Case types to avoid? | textarea | No | — | — |
| 6 | has_gbp | Google Business Profile? | radio | No | — | Yes · No · Not sure |
| 7 | gbp_listing_url | GBP URL | url | No | has_gbp = Yes | — |

**Removed from old flow:**
- `has_multiple_locations` → Removed (captured by service_area_type)
- `current_review_count` → Removed (agency can check GBP)
- `current_rating` → Removed (agency can check GBP)

**Always visible:** 5 | **Conditional:** 1 | **Total:** 6

**Correction from consolidation_options.md:** The original estimate was 8 questions. After removing 3 (multiple locations, review count, rating) and keeping gbp_listing_url as the only conditional, the actual total is 6. Updating here as the authoritative spec.

---

## Step 8: Legal, Content & Communication

**Subtitle:** How should we work together?
**Source:** Old Steps 17, 18, 19 (minus additional_report_recipients)

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | has_advertising_restrictions | Special advertising rules? | radio | No | — | Yes · No · Not sure |
| 2 | advertising_regulations | What restrictions apply? | textarea | No | has_advertising_restrictions = Yes | — |
| 3 | legal_disclaimers | Required legal disclaimers? | textarea | No | — | — |
| 4 | content_approval_required | Approve content before publishing? | radio | No | — | Yes all · Major pieces only · Trust your judgment |
| 5 | words_phrases_to_avoid | Words/phrases to avoid? | textarea | No | — | — |
| 6 | topics_to_avoid | Topics to avoid? | textarea | No | — | — |
| 7 | preferred_communication | Preferred communication method | radio | No | — | Email, Phone, Text, Slack/Teams |
| 8 | call_frequency_preference | How often to meet? | radio | No | — | Weekly, Biweekly, Monthly, Quarterly |

**Removed from old flow:**
- `additional_report_recipients` → Deferred (can be set up post-kickoff)

**Always visible:** 7 | **Conditional:** 1 | **Total:** 8

---

## Step 9: Access Checklist

**Subtitle:** Grant Clixsy access to your accounts.
**Source:** Old Steps 20-26 (minus has_lsa, lsa_customer_ids)
**See:** `access_checklist_redesign.md` for full UX specification

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | has_google_analytics | Google Analytics set up? | radio | No | — | Yes · No · Not sure |
| 2 | ga_access_status | GA access status | select | No | has_google_analytics = Yes | Done · Later · Need help · N/A |
| 3 | gsc_access_status | GSC access status | select | No | — | Done · Later · Need help · N/A |
| 4 | gbp_access_status | GBP access status | select | No | — | Done · Later · Need help · N/A |
| 5 | wordpress_access_status | WordPress access status | select | No | — | Done · Later · Need help · N/A |
| 6 | domain_access_status | Domain registrar access status | select | No | — | Done · Later · Need help · N/A |
| 7 | dns_access_status | DNS access status | select | No | — | Done · Later · Need help · N/A |
| 8 | has_youtube | YouTube channel? | radio | No | — | Yes · No |
| 9 | youtube_access_status | YouTube access status | select | No | has_youtube = Yes | Done · Later · Need help |

**Deferred from old flow:**
- `has_lsa` → Deferred (niche, ask in strategy call)
- `lsa_customer_ids` → Deferred (niche, ask in strategy call)

**Always visible:** 7 | **Conditional:** 2 | **Total:** 9

---

## Step 10: Transition & Wrap-up

**Subtitle:** Previous agency and welcome gift.
**Source:** Old Steps 27, 28 (minus shipping_preference)

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | has_previous_agency | Working with another agency? | radio | No | — | Yes · No |
| 2 | previous_agency_contact | Previous agency contact info | textarea | No | has_previous_agency = Yes | — |
| 3 | can_remove_agency_access | Help remove their access? | radio | No | has_previous_agency = Yes | Yes please · I'll handle it · Wait until transition complete |
| 4 | wants_welcome_gift | Receive a welcome gift? | radio | No | — | Yes please · No thank you |
| 5 | gift_recipient_name | Recipient Name | text | No | wants_welcome_gift = Yes | — |
| 6 | gift_shipping_address | Shipping Address | textarea | No | wants_welcome_gift = Yes | — |

**Removed from old flow:**
- `shipping_preference` → Removed (handle via email if gift accepted)

**Always visible:** 2 | **Conditional:** 4 | **Total:** 6

---

## Step 11: Review

**Subtitle:** Let's make sure everything looks good.
**Source:** Old Step 29

No form inputs. Displays validation status of incomplete required fields.

**Implementation note:** Consider embedding this as a summary panel at the top of Step 12 instead of a separate page.

---

## Step 12: Submit

**Subtitle:** Confirm and submit your onboarding.
**Source:** Old Step 30

| # | Field Key | Question | Type | Required | Conditional | Options |
|:-:|-----------|----------|:----:|:--------:|:-----------:|---------|
| 1 | confirm_accuracy | I confirm information is accurate | checkbox | No | — | — |
| 2 | confirm_proceed | I authorize Clixsy to proceed | checkbox | No | — | — |
| 3 | additional_notes | Anything else? | textarea | No | — | — |

**Always visible:** 3 | **Conditional:** 0 | **Total:** 3

---

## Summary

| New Step | Title | AV | Cond | Total | Req |
|:--------:|-------|:--:|:----:|:-----:|:---:|
| 1 | Primary Contact | 4 | 0 | 4 | 4 |
| 2 | Other Contacts | 2 | 5 | 7 | 0 |
| 3 | Business Overview | 6 | 0 | 6 | 4 |
| 4 | Goals & Strategy | 4 | 0 | 4 | 1 |
| 5 | Brand & Design | 3 | 2 | 5 | 0 |
| 6 | Technical Setup | 7 | 1 | 8 | 0 |
| 7 | SEO & Targeting | 5 | 1 | 6 | 2 |
| 8 | Legal, Content & Comms | 7 | 1 | 8 | 0 |
| 9 | Access Checklist | 7 | 2 | 9 | 0 |
| 10 | Transition & Wrap-up | 2 | 4 | 6 | 0 |
| 11 | Review | 0 | 0 | 0 | 0 |
| 12 | Submit | 3 | 0 | 3 | 0 |
| **TOTAL** | | **50** | **16** | **66** | **11** |

**Note:** Final question count is 66 (not 67 as estimated in consolidation_options.md). The difference is due to `typography_fonts` being re-included here and `form_submission_destinations` being properly counted. This spec is authoritative.

## Deferred Questions (to collect post-onboarding)

| Field Key | Question | Collection Method |
|-----------|----------|-------------------|
| year_founded | When was your firm founded? | Kickoff call |
| firm_size | How many people at your firm? | Kickoff call |
| current_lead_volume | Leads per month? | Kickoff call (with analytics context) |
| target_lead_volume | Target leads per month? | Kickoff call (with analytics context) |
| additional_report_recipients | Who else gets reports? | Post-kickoff email |
| has_lsa | Local Services Ads? | Strategy call |
| lsa_customer_ids | LSA Customer IDs | Strategy call |
| typography_fonts | What fonts? | *(Optional: kept in flow or defer — see decision worksheet)* |

## Removed Questions (no collection needed)

| Field Key | Question | Rationale |
|-----------|----------|-----------|
| location_type | Location type? | Irrelevant to marketing services |
| how_long_at_location | How long at location? | Irrelevant to marketing services |
| has_logo_files | High-quality logo files? | Agency requests files directly |
| has_multiple_locations | Multiple locations? | Redundant with service_area_type |
| current_review_count | Google review count? | Agency can self-serve via GBP |
| current_rating | Star rating? | Agency can self-serve via GBP |
| shipping_preference | Shipping instructions? | Handle via email if gift accepted |
