import { z } from 'zod';

// =============================================
// ONBOARDING STEP DEFINITIONS
// =============================================

export interface OnboardingField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
  dependsOn?: { field: string; value: string | boolean };
}

export interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  fields: OnboardingField[];
  estimatedTime?: string;
}

// =============================================
// STEP DEFINITIONS
// =============================================

export const onboardingSteps: OnboardingStep[] = [
  {
    key: 'business_overview',
    title: 'Business Overview',
    description: 'Tell us about your business so we can better understand your needs.',
    estimatedTime: '5 min',
    fields: [
      { name: 'legal_business_name', label: 'Legal Business Name', type: 'text', required: true, placeholder: 'ABC Company Ltd' },
      { name: 'trading_name', label: 'Trading Name (if different)', type: 'text', placeholder: 'ABC Co' },
      { name: 'website_url', label: 'Website URL', type: 'url', required: true, placeholder: 'https://example.com' },
      { name: 'primary_contact_name', label: 'Primary Contact Name', type: 'text', required: true },
      { name: 'primary_contact_email', label: 'Primary Contact Email', type: 'email', required: true },
      { name: 'primary_contact_phone', label: 'Primary Contact Phone', type: 'tel' },
      { name: 'other_stakeholders', label: 'Other Stakeholders', type: 'textarea', placeholder: 'Name, Role, Email (one per line)', helpText: 'List any other team members who should be involved' },
      { name: 'physical_address', label: 'Physical Address', type: 'textarea' },
      { name: 'service_areas', label: 'Service Areas', type: 'text', placeholder: 'e.g., Greater London, UK-wide, Global' },
      { name: 'timezone', label: 'Timezone', type: 'select', options: [
        { value: 'gmt', label: 'GMT (London)' },
        { value: 'est', label: 'EST (New York)' },
        { value: 'pst', label: 'PST (Los Angeles)' },
        { value: 'cet', label: 'CET (Central Europe)' },
        { value: 'sast', label: 'SAST (South Africa)' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'business_description', label: 'What do you sell and to whom?', type: 'textarea', required: true, helpText: 'Brief description of your products/services and target audience' },
      { name: 'unique_selling_points', label: 'Unique Selling Points', type: 'textarea', helpText: 'What makes you different from competitors?' },
      { name: 'competitor_1', label: 'Competitor 1 (URL)', type: 'url', placeholder: 'https://competitor1.com' },
      { name: 'competitor_2', label: 'Competitor 2 (URL)', type: 'url', placeholder: 'https://competitor2.com' },
      { name: 'competitor_3', label: 'Competitor 3 (URL)', type: 'url', placeholder: 'https://competitor3.com' },
    ]
  },
  {
    key: 'goals_kpis',
    title: 'Goals & KPIs',
    description: 'Help us understand what success looks like for your business.',
    estimatedTime: '4 min',
    fields: [
      { name: 'primary_goal', label: 'Primary Goal', type: 'select', required: true, options: [
        { value: 'leads', label: 'Generate Leads' },
        { value: 'sales', label: 'Increase Sales' },
        { value: 'calls', label: 'Phone Calls' },
        { value: 'bookings', label: 'Appointments/Bookings' },
        { value: 'store_visits', label: 'Store Visits' },
        { value: 'brand_awareness', label: 'Brand Awareness' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'secondary_goals', label: 'Secondary Goals', type: 'textarea', placeholder: 'List any additional objectives' },
      { name: 'target_monthly_leads', label: 'Target Monthly Leads', type: 'text', placeholder: 'e.g., 50' },
      { name: 'target_cpa', label: 'Target Cost Per Acquisition', type: 'text', placeholder: 'e.g., $50' },
      { name: 'target_roas', label: 'Target ROAS', type: 'text', placeholder: 'e.g., 4:1' },
      { name: 'current_baseline', label: 'Current Performance Baseline', type: 'textarea', helpText: 'What are your current numbers? (if known)' },
      { name: 'priority_products', label: 'Priority Products/Services', type: 'textarea', helpText: 'Which offerings should we focus on first?' },
      { name: 'seasonality', label: 'Seasonality Notes', type: 'textarea', placeholder: 'e.g., Peak in Q4, slow in January' },
      { name: 'target_markets', label: 'Target Markets', type: 'text', placeholder: 'e.g., UK, USA, Australia' },
    ]
  },
  {
    key: 'brand_compliance',
    title: 'Brand & Compliance',
    description: 'Share your brand guidelines and any industry regulations we need to know about.',
    estimatedTime: '3 min',
    fields: [
      { name: 'brand_guidelines_url', label: 'Brand Guidelines Link', type: 'url', placeholder: 'https://...' },
      { name: 'tone_of_voice', label: 'Tone of Voice', type: 'textarea', placeholder: 'e.g., Professional but friendly, Technical, Casual' },
      { name: 'industry_restrictions', label: 'Industry Restrictions', type: 'select', options: [
        { value: 'none', label: 'None' },
        { value: 'healthcare', label: 'Healthcare/Medical' },
        { value: 'finance', label: 'Financial Services' },
        { value: 'legal', label: 'Legal' },
        { value: 'alcohol', label: 'Alcohol' },
        { value: 'gambling', label: 'Gambling' },
        { value: 'other', label: 'Other Regulated Industry' }
      ]},
      { name: 'required_disclaimers', label: 'Required Disclaimers', type: 'textarea', placeholder: 'Any legal disclaimers that must appear in marketing' },
      { name: 'approval_workflow', label: 'Who signs off on marketing materials?', type: 'text' },
      { name: 'consent_access_accounts', label: 'I authorize the agency to access and manage my marketing accounts', type: 'checkbox', required: true },
      { name: 'consent_run_ads', label: 'I authorize the agency to run advertising campaigns on my behalf', type: 'checkbox', required: true },
      { name: 'consent_data_processing', label: 'I acknowledge and agree to the data processing terms', type: 'checkbox', required: true },
    ]
  },
  {
    key: 'website_technical',
    title: 'Website & Technical Access',
    description: 'Help us understand your technical setup for seamless integration.',
    estimatedTime: '4 min',
    fields: [
      { name: 'cms_platform', label: 'CMS Platform', type: 'select', options: [
        { value: 'wordpress', label: 'WordPress' },
        { value: 'shopify', label: 'Shopify' },
        { value: 'webflow', label: 'Webflow' },
        { value: 'wix', label: 'Wix' },
        { value: 'squarespace', label: 'Squarespace' },
        { value: 'custom', label: 'Custom Built' },
        { value: 'other', label: 'Other' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'hosting_provider', label: 'Hosting Provider', type: 'text', placeholder: 'e.g., GoDaddy, AWS, Bluehost' },
      { name: 'hosting_access_method', label: 'Hosting Access Method', type: 'text', placeholder: 'How do we access? (cPanel, SSH, etc.)' },
      { name: 'domain_registrar', label: 'Domain Registrar', type: 'text', placeholder: 'e.g., GoDaddy, Namecheap' },
      { name: 'has_staging', label: 'Do you have a staging environment?', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'dns_controller', label: 'Who controls DNS?', type: 'text', placeholder: 'e.g., IT department, domain registrar' },
      { name: 'existing_plugins', label: 'Existing SEO/Marketing Plugins', type: 'textarea', placeholder: 'e.g., Yoast, Rank Math, GTM' },
      { name: 'form_system', label: 'Form System', type: 'text', placeholder: 'e.g., Contact Form 7, Gravity Forms, HubSpot' },
    ]
  },
  {
    key: 'analytics_tracking',
    title: 'Analytics & Tracking',
    description: 'Tell us about your current analytics and tracking setup.',
    estimatedTime: '4 min',
    fields: [
      { name: 'ga4_property_id', label: 'GA4 Property ID', type: 'text', placeholder: 'e.g., G-XXXXXXXXXX' },
      { name: 'ga4_admin_email', label: 'GA4 Admin Email (to grant access)', type: 'email' },
      { name: 'gtm_container_id', label: 'GTM Container ID', type: 'text', placeholder: 'e.g., GTM-XXXXXXX' },
      { name: 'current_conversions', label: 'Currently Tracked Conversions', type: 'textarea', placeholder: 'e.g., Form submissions, Phone clicks, Purchases' },
      { name: 'call_tracking_provider', label: 'Call Tracking Provider', type: 'text', placeholder: 'e.g., CallRail, Marchex, None' },
      { name: 'crm_system', label: 'CRM System', type: 'select', options: [
        { value: 'hubspot', label: 'HubSpot' },
        { value: 'salesforce', label: 'Salesforce' },
        { value: 'zoho', label: 'Zoho' },
        { value: 'pipedrive', label: 'Pipedrive' },
        { value: 'none', label: 'None' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'key_conversion_definitions', label: 'Key Conversion Definitions', type: 'textarea', helpText: 'What actions count as conversions? (form submit, call, purchase, etc.)' },
      { name: 'consent_mode_status', label: 'Consent Mode Status', type: 'radio', options: [
        { value: 'implemented', label: 'Implemented' },
        { value: 'not_implemented', label: 'Not Implemented' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'offline_conversions', label: 'Do you track offline conversions?', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'interested', label: 'Interested in setting up' }
      ]},
    ]
  },
  {
    key: 'google_search_console',
    title: 'Google Search Console',
    description: 'Tell us about your Search Console setup.',
    estimatedTime: '2 min',
    fields: [
      { name: 'gsc_setup', label: 'Is GSC set up?', type: 'radio', required: true, options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'gsc_property_type', label: 'GSC Property Type', type: 'radio', options: [
        { value: 'domain', label: 'Domain Property' },
        { value: 'url_prefix', label: 'URL Prefix' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'gsc_verified_owner_email', label: 'Verified Owner Email', type: 'email' },
      { name: 'sitemaps_submitted', label: 'Sitemaps Submitted?', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'known_indexation_issues', label: 'Known Indexation Issues', type: 'textarea', placeholder: 'Any pages not being indexed?' },
      { name: 'manual_actions_history', label: 'Any Manual Actions History?', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
    ]
  },
  {
    key: 'local_seo_gbp',
    title: 'Local SEO & Google Business Profile',
    description: 'For businesses with physical locations or local service areas.',
    estimatedTime: '3 min',
    fields: [
      { name: 'has_gbp', label: 'Do you have a Google Business Profile?', type: 'radio', required: true, options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'gbp_listing_urls', label: 'GBP Listing URL(s)', type: 'textarea', placeholder: 'Paste your Google Business Profile URL(s)' },
      { name: 'nap_consistency', label: 'NAP Consistency Notes', type: 'textarea', helpText: 'Name, Address, Phone - are they consistent across the web?' },
      { name: 'business_categories', label: 'Business Categories', type: 'text', placeholder: 'e.g., Digital Marketing Agency, SEO Consultant' },
      { name: 'gbp_service_areas', label: 'Service Areas (for GBP)', type: 'textarea' },
      { name: 'review_strategy', label: 'Review Strategy & Reputation Concerns', type: 'textarea', placeholder: 'Current review count, rating, any reputation issues' },
      { name: 'number_of_locations', label: 'Number of Locations', type: 'text', placeholder: 'e.g., 1, 5, 20+' },
      { name: 'photos_assets_available', label: 'Photos & Brand Assets Available?', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'some', label: 'Some' }
      ]},
    ]
  },
  {
    key: 'seo_discovery',
    title: 'SEO Discovery',
    description: 'Help us understand your SEO history and content assets.',
    estimatedTime: '5 min',
    fields: [
      { name: 'core_services_list', label: 'Core Services/Products List', type: 'textarea', required: true, placeholder: 'List your main offerings (one per line)' },
      { name: 'priority_locations', label: 'Priority Locations (if local)', type: 'textarea', placeholder: 'Cities, regions, or countries to target' },
      { name: 'known_keywords', label: 'Known Keywords You Care About', type: 'textarea', placeholder: 'Keywords you want to rank for' },
      { name: 'past_seo_work', label: 'Past SEO Work Summary', type: 'textarea', helpText: 'What SEO has been done before? By whom? When?' },
      { name: 'past_penalties', label: 'Past Penalties or Traffic Drops', type: 'textarea', placeholder: 'Any known issues? Approximate dates?' },
      { name: 'content_assets', label: 'Available Content Assets', type: 'multiselect', options: [
        { value: 'blog', label: 'Blog Posts' },
        { value: 'case_studies', label: 'Case Studies' },
        { value: 'landing_pages', label: 'Landing Pages' },
        { value: 'whitepapers', label: 'Whitepapers/Guides' },
        { value: 'videos', label: 'Videos' },
        { value: 'infographics', label: 'Infographics' }
      ]},
      { name: 'subject_matter_experts', label: 'Subject Matter Experts for Interviews', type: 'textarea', placeholder: 'Who can we interview for content creation?' },
      { name: 'competitors_to_benchmark', label: 'Competitors to Benchmark', type: 'textarea', placeholder: 'Who are you competing against in search?' },
    ]
  },
  {
    key: 'ppc_paid_media',
    title: 'PPC & Paid Media',
    description: 'Tell us about your paid advertising history and goals.',
    estimatedTime: '5 min',
    fields: [
      { name: 'platforms_used', label: 'Platforms Used', type: 'multiselect', options: [
        { value: 'google_ads', label: 'Google Ads' },
        { value: 'microsoft_ads', label: 'Microsoft Ads' },
        { value: 'meta', label: 'Meta (Facebook/Instagram)' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'none', label: 'None Currently' }
      ]},
      { name: 'account_ids_access', label: 'Account IDs / Access Emails', type: 'textarea', placeholder: 'List account IDs or emails to grant access' },
      { name: 'current_monthly_spend', label: 'Current Monthly Spend', type: 'text', placeholder: 'e.g., $5,000' },
      { name: 'target_monthly_spend', label: 'Target Monthly Spend', type: 'text', placeholder: 'e.g., $10,000' },
      { name: 'primary_campaigns', label: 'Primary Campaigns & Offers', type: 'textarea', placeholder: 'What are you promoting?' },
      { name: 'geo_targeting', label: 'Geo Targeting', type: 'text', placeholder: 'Where do you target ads?' },
      { name: 'restricted_policies', label: 'Any Restricted Policies or Approvals Needed?', type: 'textarea' },
      { name: 'top_converting_keywords', label: 'Top Converting Keywords (if known)', type: 'textarea' },
      { name: 'negative_keyword_themes', label: 'Negative Keyword Themes', type: 'textarea', placeholder: 'What should we exclude?' },
      { name: 'landing_pages_used', label: 'Landing Pages Used', type: 'textarea', placeholder: 'URLs of pages used in ads' },
      { name: 'conversion_tracking_status', label: 'Conversion Tracking Status', type: 'radio', options: [
        { value: 'fully_setup', label: 'Fully Set Up' },
        { value: 'partial', label: 'Partially Set Up' },
        { value: 'not_setup', label: 'Not Set Up' },
        { value: 'not_sure', label: 'Not Sure' }
      ]},
      { name: 'remarketing_audiences', label: 'Remarketing Audiences', type: 'textarea', placeholder: 'Any existing audiences set up?' },
    ]
  },
  {
    key: 'social_creative',
    title: 'Social & Creative',
    description: 'Tell us about your social media presence and creative capabilities.',
    estimatedTime: '3 min',
    fields: [
      { name: 'social_profiles', label: 'Social Profile URLs', type: 'textarea', placeholder: 'Facebook, Instagram, LinkedIn, Twitter, etc.' },
      { name: 'posting_frequency', label: 'Current Posting Frequency', type: 'text', placeholder: 'e.g., Daily, Weekly, Monthly' },
      { name: 'creative_assets_available', label: 'Available Creative Assets', type: 'textarea', placeholder: 'Photos, videos, graphics, etc.' },
      { name: 'brand_dos_donts', label: 'Brand Do\'s and Don\'ts', type: 'textarea', placeholder: 'What should/shouldn\'t be in creative?' },
      { name: 'video_capabilities', label: 'Video Capabilities', type: 'radio', options: [
        { value: 'in_house', label: 'In-house production' },
        { value: 'external', label: 'External vendor' },
        { value: 'none', label: 'No video capability' },
        { value: 'need_help', label: 'Need help with this' }
      ]},
      { name: 'creative_approval_process', label: 'Creative Approval Process', type: 'textarea', placeholder: 'Who approves creative? How long does it take?' },
    ]
  },
  {
    key: 'sales_operations',
    title: 'Sales Pipeline & Operations',
    description: 'Help us understand how leads are handled after they come in.',
    estimatedTime: '3 min',
    fields: [
      { name: 'lead_handler', label: 'Who Handles Leads?', type: 'text', placeholder: 'e.g., Sales team, Owner, Reception' },
      { name: 'lead_response_time', label: 'Average Lead Response Time', type: 'text', placeholder: 'e.g., Within 1 hour, Same day, Next day' },
      { name: 'operating_hours', label: 'Operating Hours', type: 'text', placeholder: 'e.g., Mon-Fri 9am-5pm GMT' },
      { name: 'booking_software', label: 'Booking Software', type: 'text', placeholder: 'e.g., Calendly, Acuity, None' },
      { name: 'crm_stages', label: 'CRM Stages', type: 'textarea', placeholder: 'What are your sales pipeline stages?' },
      { name: 'common_objections', label: 'Common Sales Objections', type: 'textarea', placeholder: 'What concerns do prospects usually have?' },
      { name: 'top_close_reasons', label: 'Top Reasons Customers Choose You', type: 'textarea' },
      { name: 'top_loss_reasons', label: 'Top Reasons Customers Don\'t Choose You', type: 'textarea' },
    ]
  },
  {
    key: 'final_review',
    title: 'Review & Submit',
    description: 'Review your information and submit the onboarding form.',
    estimatedTime: '2 min',
    fields: [
      { name: 'confirm_accuracy', label: 'I confirm that the information provided is accurate to the best of my knowledge', type: 'checkbox', required: true },
      { name: 'confirm_proceed', label: 'I authorize the agency to proceed with the marketing setup based on this information', type: 'checkbox', required: true },
      { name: 'additional_notes', label: 'Additional Notes or Questions', type: 'textarea', placeholder: 'Anything else you\'d like us to know?' },
    ]
  }
];

// =============================================
// ZOD VALIDATION SCHEMAS
// =============================================

// Helper to create optional string
const optionalString = z.string().optional().or(z.literal(''));
const optionalUrl = z.string().url().optional().or(z.literal(''));
const optionalEmail = z.string().email().optional().or(z.literal(''));

// Step-specific validation schemas
export const stepValidationSchemas: Record<string, z.ZodSchema> = {
  business_overview: z.object({
    legal_business_name: z.string().min(1, 'Legal business name is required'),
    trading_name: optionalString,
    website_url: z.string().url('Please enter a valid URL'),
    primary_contact_name: z.string().min(1, 'Primary contact name is required'),
    primary_contact_email: z.string().email('Please enter a valid email'),
    primary_contact_phone: optionalString,
    other_stakeholders: optionalString,
    physical_address: optionalString,
    service_areas: optionalString,
    timezone: optionalString,
    business_description: z.string().min(1, 'Please describe your business'),
    unique_selling_points: optionalString,
    competitor_1: optionalUrl,
    competitor_2: optionalUrl,
    competitor_3: optionalUrl,
  }),
  goals_kpis: z.object({
    primary_goal: z.string().min(1, 'Please select a primary goal'),
    secondary_goals: optionalString,
    target_monthly_leads: optionalString,
    target_cpa: optionalString,
    target_roas: optionalString,
    current_baseline: optionalString,
    priority_products: optionalString,
    seasonality: optionalString,
    target_markets: optionalString,
  }),
  brand_compliance: z.object({
    brand_guidelines_url: optionalUrl,
    tone_of_voice: optionalString,
    industry_restrictions: optionalString,
    required_disclaimers: optionalString,
    approval_workflow: optionalString,
    consent_access_accounts: z.boolean().refine(val => val === true, 'You must authorize account access'),
    consent_run_ads: z.boolean().refine(val => val === true, 'You must authorize running ads'),
    consent_data_processing: z.boolean().refine(val => val === true, 'You must agree to data processing terms'),
  }),
  website_technical: z.object({
    cms_platform: optionalString,
    hosting_provider: optionalString,
    hosting_access_method: optionalString,
    domain_registrar: optionalString,
    has_staging: optionalString,
    dns_controller: optionalString,
    existing_plugins: optionalString,
    form_system: optionalString,
  }),
  analytics_tracking: z.object({
    ga4_property_id: optionalString,
    ga4_admin_email: optionalEmail,
    gtm_container_id: optionalString,
    current_conversions: optionalString,
    call_tracking_provider: optionalString,
    crm_system: optionalString,
    key_conversion_definitions: optionalString,
    consent_mode_status: optionalString,
    offline_conversions: optionalString,
  }),
  google_search_console: z.object({
    gsc_setup: z.string().min(1, 'Please indicate GSC status'),
    gsc_property_type: optionalString,
    gsc_verified_owner_email: optionalEmail,
    sitemaps_submitted: optionalString,
    known_indexation_issues: optionalString,
    manual_actions_history: optionalString,
  }),
  local_seo_gbp: z.object({
    has_gbp: z.string().min(1, 'Please indicate GBP status'),
    gbp_listing_urls: optionalString,
    nap_consistency: optionalString,
    business_categories: optionalString,
    gbp_service_areas: optionalString,
    review_strategy: optionalString,
    number_of_locations: optionalString,
    photos_assets_available: optionalString,
  }),
  seo_discovery: z.object({
    core_services_list: z.string().min(1, 'Please list your core services'),
    priority_locations: optionalString,
    known_keywords: optionalString,
    past_seo_work: optionalString,
    past_penalties: optionalString,
    content_assets: z.array(z.string()).optional(),
    subject_matter_experts: optionalString,
    competitors_to_benchmark: optionalString,
  }),
  ppc_paid_media: z.object({
    platforms_used: z.array(z.string()).optional(),
    account_ids_access: optionalString,
    current_monthly_spend: optionalString,
    target_monthly_spend: optionalString,
    primary_campaigns: optionalString,
    geo_targeting: optionalString,
    restricted_policies: optionalString,
    top_converting_keywords: optionalString,
    negative_keyword_themes: optionalString,
    landing_pages_used: optionalString,
    conversion_tracking_status: optionalString,
    remarketing_audiences: optionalString,
  }),
  social_creative: z.object({
    social_profiles: optionalString,
    posting_frequency: optionalString,
    creative_assets_available: optionalString,
    brand_dos_donts: optionalString,
    video_capabilities: optionalString,
    creative_approval_process: optionalString,
  }),
  sales_operations: z.object({
    lead_handler: optionalString,
    lead_response_time: optionalString,
    operating_hours: optionalString,
    booking_software: optionalString,
    crm_stages: optionalString,
    common_objections: optionalString,
    top_close_reasons: optionalString,
    top_loss_reasons: optionalString,
  }),
  final_review: z.object({
    confirm_accuracy: z.boolean().refine(val => val === true, 'You must confirm accuracy'),
    confirm_proceed: z.boolean().refine(val => val === true, 'You must authorize proceeding'),
    additional_notes: optionalString,
  }),
};

// Get step by key
export function getStepByKey(key: string): OnboardingStep | undefined {
  return onboardingSteps.find(step => step.key === key);
}

// Get step index by key
export function getStepIndex(key: string): number {
  return onboardingSteps.findIndex(step => step.key === key);
}

// Validate step data
export function validateStepData(stepKey: string, data: Record<string, unknown>): { success: boolean; errors?: Record<string, string> } {
  const schema = stepValidationSchemas[stepKey];
  if (!schema) {
    return { success: true };
  }

  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return { success: false, errors };
}
