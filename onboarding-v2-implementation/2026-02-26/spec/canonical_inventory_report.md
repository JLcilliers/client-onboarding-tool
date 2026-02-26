# Canonical Inventory Report

## Source
- **Product:** Clixsy Onboarding Portal
- **URL:** https://client-onboarding-tool.vercel.app
- **Inventory Date:** 2026-02-26
- **Method:** Playwright browser walkthrough (read-only, stopped before submission)
- **Environment:** Pre-production (Vercel)

## Totals

| Metric | Count |
|--------|-------|
| Total steps | 30 |
| Total questions | 82 |
| Always-visible questions | 62 |
| Conditional questions | 20 |
| Required fields | 11 |
| Conditional branches | 11 |
| Info/meta steps (no inputs) | 1 (Step 29) |
| Confirmation-only steps | 1 (Step 30) |

## Per-Step Breakdown

| Step | Title | Category | Always Visible | Conditional | Total | Required |
|------|-------|----------|:-:|:-:|:-:|:-:|
| 1 | Primary Contact | Contact Information | 4 | 0 | 4 | 4 |
| 2 | Additional Contacts | Contact Information | 1 | 3 | 4 | 0 |
| 3 | Technical Contact | Contact Information | 1 | 2 | 3 | 0 |
| 4 | Business Basics | Business Information | 4 | 0 | 4 | 3 |
| 5 | Business Location | Business Information | 3 | 0 | 3 | 1 |
| 6 | Business Details | Business Information | 3 | 0 | 3 | 0 |
| 7 | Vision & Goals | Goals & Strategy | 3 | 0 | 3 | 1 |
| 8 | Success Metrics | Goals & Strategy | 3 | 0 | 3 | 0 |
| 9 | Brand Assets | Brand & Design | 2 | 0 | 2 | 0 |
| 10 | Brand Colors & Fonts | Brand & Design | 2 | 2 | 4 | 0 |
| 11 | Domain & Website | Technical Setup | 3 | 0 | 3 | 0 |
| 12 | Website Platform | Technical Setup | 2 | 0 | 2 | 0 |
| 13 | Lead Tracking | Technical Setup | 2 | 1 | 3 | 0 |
| 14 | Target Areas | SEO & Marketing | 3 | 0 | 3 | 1 |
| 15 | Case Types & Keywords | SEO & Marketing | 3 | 0 | 3 | 1 |
| 16 | Google Business Profile | SEO & Marketing | 1 | 3 | 4 | 0 |
| 17 | Legal & Compliance | Legal | 2 | 1 | 3 | 0 |
| 18 | Content Preferences | Communication | 3 | 0 | 3 | 0 |
| 19 | Communication | Communication | 3 | 0 | 3 | 0 |
| 20 | Google Analytics Access | Access Provisioning | 1 | 1 | 2 | 0 |
| 21 | Google Search Console Access | Access Provisioning | 1 | 0 | 1 | 0 |
| 22 | Google Business Profile Access | Access Provisioning | 1 | 0 | 1 | 0 |
| 23 | WordPress Access | Access Provisioning | 1 | 0 | 1 | 0 |
| 24 | Domain Registrar Access | Access Provisioning | 1 | 0 | 1 | 0 |
| 25 | Cloudflare / DNS Access | Access Provisioning | 1 | 0 | 1 | 0 |
| 26 | Other Access | Access Provisioning | 2 | 2 | 4 | 0 |
| 27 | Previous Agency | Transition | 1 | 2 | 3 | 0 |
| 28 | Welcome Gift | Onboarding Experience | 1 | 3 | 4 | 0 |
| 29 | Almost There! | Review | 0* | 0 | 0* | 0 |
| 30 | Ready to Submit | Submission | 3 | 0 | 3 | 0 |
| **TOTAL** | | | **62** | **20** | **82** | **11** |

*Step 29 has 1 info-text element (not a form input).

## Questions by Category

| Category | Steps | Questions | % of Total |
|----------|:-----:|:---------:|:----------:|
| Contact Information | 1-3 | 11 | 13.4% |
| Business Information | 4-6 | 10 | 12.2% |
| Goals & Strategy | 7-8 | 6 | 7.3% |
| Brand & Design | 9-10 | 6 | 7.3% |
| Technical Setup | 11-13 | 8 | 9.8% |
| SEO & Marketing | 14-16 | 10 | 12.2% |
| Legal & Compliance | 17 | 3 | 3.7% |
| Communication & Preferences | 18-19 | 6 | 7.3% |
| Access Provisioning | 20-26 | 11 | 13.4% |
| Transition | 27 | 3 | 3.7% |
| Onboarding Experience | 28 | 4 | 4.9% |
| Review + Submission | 29-30 | 4 | 4.9% |

## Questions by Input Type

| Type | Count | % |
|------|:-----:|:-:|
| radio | 32 | 39.0% |
| textarea | 17 | 20.7% |
| text | 12 | 14.6% |
| select | 10 | 12.2% |
| email | 2 | 2.4% |
| tel | 2 | 2.4% |
| url | 2 | 2.4% |
| checkbox-group | 2 | 2.4% |
| checkbox | 2 | 2.4% |
| info-text | 1 | 1.2% |

## Biggest Drivers of Perceived Length

### 1. Access Provisioning (Steps 20-26) — 7 steps, 11 questions
These seven steps follow an identical pattern: a single radio question asking whether the client has granted access to a Clixsy email. Steps 21-25 have exactly **1 question each**. This is the single biggest driver of step count — 7 of 30 steps (23%) for only 11 of 82 questions (13%).

### 2. Single-Question Steps
Eight steps have only 1 always-visible question:
- Steps 21, 22, 23, 24, 25 (access provisioning — 1 question each)
- Step 20 (1 always-visible + 1 conditional)
- Step 27 (1 always-visible + 2 conditional)
- Step 28 (1 always-visible + 3 conditional)

These contribute to a "click-heavy" experience where users navigate more than they fill out.

### 3. Low Required-Field Density
Only 11 of 82 questions (13.4%) are required. The form presents 71 optional questions with equal weight to 11 required ones. The user has no way to distinguish "must answer" from "nice to have" without reading each question.

### 4. Meta Steps Add to Count (Steps 29-30)
Step 29 is a review page with no inputs. Step 30 has 2 confirmatory checkboxes and a notes field. These 2 steps add to the "30 steps" count without gathering new information.

## Conditional Logic Summary

| Trigger Step | Trigger Field | Trigger Value | Fields Revealed | Count |
|:---:|---------------|---------------|-----------------|:-----:|
| 2 | has_secondary_contact | Yes | secondary name, email, phone | 3 |
| 3 | has_tech_contact | Yes (either) | tech name, email | 2 |
| 10 | knows_brand_colors | Yes, I know them | primary_color, secondary_color | 2 |
| 13 | uses_call_tracking | Yes | call_tracking_provider | 1 |
| 16 | has_gbp | Yes | gbp_listing_url, review count, rating | 3 |
| 17 | has_advertising_restrictions | Yes | advertising_regulations | 1 |
| 20 | has_google_analytics | Yes | ga_access_granted | 1 |
| 26 | has_youtube | Yes | youtube_access_granted | 1 |
| 26 | has_lsa | Yes | lsa_customer_ids | 1 |
| 27 | has_previous_agency | Yes | agency contact, remove access | 2 |
| 28 | wants_welcome_gift | Yes, please! | recipient, address, preference | 3 |
| | | | **Total conditional fields** | **20** |

## Data Integrity Cross-Check

| Check | Result |
|-------|--------|
| JSON total questions matches CSV rows | PASS (82 = 82) |
| Always-visible + conditional = total | PASS (62 + 20 = 82) |
| Required count matches field-level flags | PASS (11) |
| Every step has evidence screenshot | PASS (30/30) |
| No duplicate field keys across steps | PASS |
| Step count matches UI indicator | PASS (30/30) |
