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
  shortTitle: string;
  description: string;
  fields: OnboardingField[];
  estimatedTime?: string;
}

// =============================================
// STEP DEFINITIONS - Based on Clixsy Onboarding Document
// =============================================

export const onboardingSteps: OnboardingStep[] = [
  // -----------------------------------------------
  // SECTION 1: PRIMARY & SECONDARY CONTACT INFORMATION
  // -----------------------------------------------
  {
    key: 'contact_information',
    title: 'Contact Information',
    shortTitle: 'CONTACT',
    description: 'Provide details for your main contacts so we can communicate effectively.',
    estimatedTime: '4 min',
    fields: [
      // Main Point of Contact (Decision Maker)
      {
        name: 'main_contact_name',
        label: 'Main Point of Contact (Decision Maker) - Full Name',
        type: 'text',
        required: true,
        helpText: 'This should be a single person with ultimate authority over the project.'
      },
      { name: 'main_contact_title', label: 'Title/Role', type: 'text', required: true },
      { name: 'main_contact_email', label: 'Email Address', type: 'email', required: true },
      { name: 'main_contact_phone', label: 'Best Contact Number', type: 'tel', required: true },

      // Secondary Point of Contact
      {
        name: 'secondary_contact_name',
        label: 'Secondary Contact - Full Name',
        type: 'text',
        helpText: 'Authorized to speak on behalf of the firm for minor matters.'
      },
      { name: 'secondary_contact_email', label: 'Secondary Contact - Email Address', type: 'email' },
      { name: 'secondary_contact_phone', label: 'Secondary Contact - Best Contact Number', type: 'tel' },

      // Technical/IT Contact
      {
        name: 'tech_contact_name',
        label: 'Technical/IT Contact - Full Name',
        type: 'text',
        helpText: 'The dedicated individual for technical or IT-related inquiries.'
      },
      { name: 'tech_contact_email', label: 'Technical/IT Contact - Email Address', type: 'email' },
      { name: 'tech_contact_phone', label: 'Technical/IT Contact - Direct Phone Number', type: 'tel' },

      // Dedicated Agency/Vendor Contact
      {
        name: 'previous_agency_contact',
        label: 'Previous Agency/Vendor Contact',
        type: 'textarea',
        placeholder: 'Name, email, phone',
        helpText: 'For transitioning from a previous agency - the point of contact for technical hand-off questions.'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 2: DETAILED COMPANY & BUSINESS PROFILE
  // -----------------------------------------------
  {
    key: 'business_profile',
    title: 'Company & Business Profile',
    shortTitle: 'PROFILE',
    description: 'Tell us about your business so we can better understand your firm.',
    estimatedTime: '5 min',
    fields: [
      { name: 'business_name', label: 'Business Name', type: 'text', required: true },
      { name: 'website_url', label: 'Main Website URL', type: 'url', required: true, placeholder: 'https://example.com' },
      { name: 'owner_names', label: 'Owner/Main Partner(s) Full Name(s)', type: 'textarea', placeholder: 'List all owners/partners, one per line' },
      {
        name: 'physical_address',
        label: 'Physical Company Address',
        type: 'textarea',
        required: true,
        helpText: 'Provide the exact address as it appears on your Google Business Profile (GBP).'
      },
      { name: 'move_in_date', label: 'Move-In Date at Current Location', type: 'text', placeholder: 'e.g., January 2020' },
      { name: 'business_phone', label: 'Main Business Phone Number', type: 'tel', required: true },
      { name: 'year_founded', label: 'Year the Firm was Founded', type: 'text', placeholder: 'e.g., 2015' },
      { name: 'languages_spoken', label: 'Languages Spoken at the Firm', type: 'text', placeholder: 'e.g., English, Spanish' },

      // Legal & Tax Identification
      { name: 'owner_license_number', label: 'Owner License Number', type: 'text' },
      { name: 'license_issue_date', label: 'License Issue Date', type: 'text', placeholder: 'e.g., March 2018' },
      { name: 'ein_number', label: 'EIN (Employer Identification Number)', type: 'text', placeholder: 'XX-XXXXXXX' },
    ]
  },

  // -----------------------------------------------
  // SECTION 3: VISION, STRATEGY, & KPIs
  // -----------------------------------------------
  {
    key: 'vision_strategy',
    title: 'Vision, Strategy, & KPIs',
    shortTitle: 'VISION',
    description: 'Help us understand what success looks like for your firm.',
    estimatedTime: '5 min',
    fields: [
      {
        name: 'success_definition',
        label: 'Success Definition (12-Month Outlook)',
        type: 'textarea',
        required: true,
        helpText: 'Imagine yourself 12 months from now—what results would make you completely satisfied with our progress?'
      },
      {
        name: 'magic_wand_outcome',
        label: 'The "Magic Wand" Outcome',
        type: 'textarea',
        helpText: 'What would the perfect outcome of our work together look like?'
      },
      {
        name: 'current_challenges',
        label: 'Current Challenges',
        type: 'textarea',
        helpText: 'What obstacles or inconsistencies are you currently facing in your marketing or SEO management?'
      },
      {
        name: 'key_performance_indicators',
        label: 'Key Performance Indicators (KPIs)',
        type: 'textarea',
        helpText: 'Which metrics do you use to measure success? (e.g., website traffic, signed leads, Google reviews, etc.)'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 4: COMPANY IDENTITY (Brand Assets)
  // -----------------------------------------------
  {
    key: 'company_identity',
    title: 'Company Identity',
    shortTitle: 'IDENTITY',
    description: 'Upload your brand assets so we can maintain visual consistency.',
    estimatedTime: '3 min',
    fields: [
      // Assets & Typography
      {
        name: 'brand_style_guide_url',
        label: 'Brand Style Guide / CI Manual',
        type: 'url',
        placeholder: 'Link to your brand guidelines (.pdf, .doc, .docx)',
        helpText: 'Provide a link to your brand style guide document.'
      },
      {
        name: 'logo_package_url',
        label: 'Logo Package (Vector: .AI, .EPS, .SVG)',
        type: 'url',
        placeholder: 'Link to your logo files (.ai, .eps, .svg, .zip)',
        helpText: 'Provide a link to your logo package.'
      },
      {
        name: 'typography_fonts',
        label: 'Typography / Fonts',
        type: 'text',
        placeholder: 'e.g., Montserrat (Headers), Open Sans (Body)'
      },

      // Brand Colors
      {
        name: 'primary_color',
        label: 'Primary Brand Color (Hex)',
        type: 'text',
        placeholder: '#000000'
      },
      {
        name: 'secondary_color',
        label: 'Secondary Brand Color (Hex)',
        type: 'text',
        placeholder: '#000000'
      },
      {
        name: 'additional_colors',
        label: 'Additional Brand Colors',
        type: 'textarea',
        placeholder: 'List any additional brand colors with hex codes'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 5: TECHNICAL ASSETS & WEBSITE MAINTENANCE
  // -----------------------------------------------
  {
    key: 'technical_assets',
    title: 'Technical Assets & Website',
    shortTitle: 'TECH',
    description: 'Tell us about your technical setup and website maintenance.',
    estimatedTime: '5 min',
    fields: [
      // Domain & DNS Management
      {
        name: 'owns_domain',
        label: 'Do you own your domain name?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'controls_dns',
        label: 'Do you have control over your DNS settings?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'other_domains',
        label: 'Other Domains',
        type: 'textarea',
        helpText: 'List any other domains you own that currently redirect to your main site.'
      },

      // Website Platform
      {
        name: 'is_wordpress',
        label: 'Is your website built using WordPress?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'website_platform_other',
        label: 'If not WordPress, what platform?',
        type: 'text',
        placeholder: 'e.g., Squarespace, Wix, Custom'
      },

      // Asset Ownership & Compliance
      {
        name: 'owns_written_content',
        label: 'Do you own all the written content on your website?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'has_imagery_licenses',
        label: 'Do you have proper licenses for all images and videos currently used?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'anti_spam_adequate',
        label: 'Is your current anti-spam solution adequate?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },

      // Lead & Form Management
      {
        name: 'form_submission_destinations',
        label: 'Form Submission Destination',
        type: 'textarea',
        helpText: 'List all email addresses or intake software where website form submissions should be sent.'
      },

      // Call Tracking Details
      {
        name: 'uses_call_tracking',
        label: 'Does your website use a call-tracking number?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'call_tracking_provider',
        label: 'Call-Tracking Provider',
        type: 'text',
        placeholder: 'e.g., CallRail, Marchex, CallTrackingMetrics'
      },
      {
        name: 'call_tracking_ownership',
        label: 'Who owns the call-tracking account/numbers?',
        type: 'radio',
        options: [
          { value: 'client', label: 'We (the client) own it' },
          { value: 'agency', label: 'The agency owns it' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },

      // Agency Access Management
      {
        name: 'can_remove_agency_access',
        label: 'Can we remove access to your website or assets for previous agencies?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_applicable', label: 'Not Applicable' }
        ]
      },
      {
        name: 'agencies_to_remove',
        label: 'Agencies to Remove',
        type: 'textarea',
        helpText: 'List all agencies whose access should be revoked.'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 6: SEO TARGETS & CASE TYPES
  // -----------------------------------------------
  {
    key: 'seo_targets',
    title: 'SEO Targets & Case Types',
    shortTitle: 'SEO',
    description: 'Define your target markets and priority keywords for your SEO campaign.',
    estimatedTime: '5 min',
    fields: [
      {
        name: 'main_geographical_areas',
        label: 'Main Geographical Areas',
        type: 'textarea',
        required: true,
        helpText: 'Specify the target markets for your campaign (cities, regions, states).'
      },
      {
        name: 'primary_case_types_keywords',
        label: 'Primary Case Types & Keywords',
        type: 'textarea',
        required: true,
        helpText: 'List the specific legal case types and keywords most important to your business.'
      },
      {
        name: 'initial_focus_areas',
        label: 'Initial Focus Areas',
        type: 'textarea',
        helpText: 'Which case types should we focus on first?'
      },
      {
        name: 'secondary_gbp_locations',
        label: 'Secondary GBP Locations',
        type: 'textarea',
        helpText: 'List any additional physical locations included in the SEO campaign.'
      },
      {
        name: 'attorney_imagery_lsa',
        label: 'Attorney Imagery (LSA)',
        type: 'url',
        placeholder: 'Link to attorney photos (zipped and named by attorney)',
        helpText: 'Provide attorney photos for Local Services Ads.'
      },
      {
        name: 'additional_campaign_info',
        label: 'Additional Campaign Info',
        type: 'textarea',
        helpText: 'List any other relevant details or goals you wish to discuss.'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 7: GOOGLE BUSINESS PROFILE
  // -----------------------------------------------
  {
    key: 'google_business_profile',
    title: 'Google Business Profile',
    shortTitle: 'GBP',
    description: 'Tell us about your Google Business Profile setup.',
    estimatedTime: '3 min',
    fields: [
      {
        name: 'has_gbp',
        label: 'Do you have a Google Business Profile?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not Sure' }
        ]
      },
      {
        name: 'gbp_listing_url',
        label: 'GBP Listing URL',
        type: 'url',
        placeholder: 'https://g.page/...'
      },
      {
        name: 'gbp_primary_category',
        label: 'Primary Business Category',
        type: 'text',
        placeholder: 'e.g., Personal Injury Attorney'
      },
      {
        name: 'gbp_secondary_categories',
        label: 'Secondary Business Categories',
        type: 'textarea',
        placeholder: 'List additional categories, one per line'
      },
      {
        name: 'current_review_count',
        label: 'Current Review Count',
        type: 'text',
        placeholder: 'e.g., 45'
      },
      {
        name: 'current_rating',
        label: 'Current Star Rating',
        type: 'text',
        placeholder: 'e.g., 4.8'
      },
      {
        name: 'nap_consistency',
        label: 'NAP Consistency Notes',
        type: 'textarea',
        helpText: 'Name, Address, Phone - are they consistent across the web?'
      },
      {
        name: 'gbp_photos_available',
        label: 'Do you have photos/videos for GBP?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'some', label: 'Some' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 8: LEGAL, COMPLIANCE, & CONTENT PREFERENCES
  // -----------------------------------------------
  {
    key: 'legal_compliance',
    title: 'Legal, Compliance, & Content',
    shortTitle: 'LEGAL',
    description: 'Share your legal and compliance requirements for marketing.',
    estimatedTime: '4 min',
    fields: [
      {
        name: 'advertising_regulations',
        label: 'Advertising Regulations',
        type: 'textarea',
        helpText: 'List any state-specific restrictions on advertising (CTA rules, fees, testimonials, etc.).'
      },
      {
        name: 'legal_disclaimers',
        label: 'Legal Disclaimers',
        type: 'textarea',
        helpText: 'Provide any mandatory disclaimers required for the website and other digital assets.'
      },

      // Forbidden Content
      {
        name: 'words_phrases_to_avoid',
        label: 'Words/Phrases to Avoid',
        type: 'textarea',
        placeholder: 'List words or phrases that should never be used'
      },
      {
        name: 'imagery_to_avoid',
        label: 'Imagery to Avoid',
        type: 'textarea',
        placeholder: 'Describe any imagery that should be avoided'
      },
      {
        name: 'topics_to_avoid',
        label: 'Topics to Avoid',
        type: 'textarea',
        placeholder: 'List any topics that should not be discussed in content'
      },

      // Brand Alignment
      {
        name: 'content_approval_required',
        label: 'Content Approval Process',
        type: 'radio',
        helpText: 'Would you like to manually review, edit, and approve all content before it is published?',
        options: [
          { value: 'yes', label: 'Yes, I want to approve all content' },
          { value: 'major_only', label: 'Only for major pieces' },
          { value: 'no', label: 'No, I trust your judgment' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 9: COMMUNICATION & REPORTING PREFERENCES
  // -----------------------------------------------
  {
    key: 'communication_preferences',
    title: 'Communication & Reporting',
    shortTitle: 'COMMS',
    description: 'Tell us how you prefer to communicate and receive updates.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'additional_report_recipients',
        label: 'Reporting Distribution',
        type: 'textarea',
        helpText: 'List any additional team members who should receive updates and reports (name and email).'
      },
      {
        name: 'missed_call_preference',
        label: 'If a reporting call is missed, would you prefer:',
        type: 'radio',
        options: [
          { value: 'video_recap', label: 'A video recap' },
          { value: 'reschedule', label: 'To reschedule the call' }
        ]
      },
      {
        name: 'call_frequency_preference',
        label: 'Do you prefer:',
        type: 'radio',
        options: [
          { value: 'monthly_calls', label: 'Monthly reporting calls' },
          { value: 'video_recaps_quarterly', label: 'Video recaps with quarterly strategy calls' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 10: TECHNICAL ACCESS & TUTORIALS
  // -----------------------------------------------
  {
    key: 'technical_access',
    title: 'Technical Access & Tutorials',
    shortTitle: 'ACCESS',
    description: 'The most critical step. Please grant access using the tutorials below.',
    estimatedTime: '10 min',
    fields: [
      // WordPress Admin Access
      {
        name: 'wordpress_access_granted',
        label: 'WordPress Admin Access',
        type: 'textarea',
        placeholder: 'I have added the user...',
        helpText: 'Add keith@clixsy.com as an Administrator. Confirm below once done.'
      },

      // Domain Registrar
      {
        name: 'domain_registrar_access',
        label: 'Domain Registrar (e.g., GoDaddy)',
        type: 'textarea',
        placeholder: 'Login details if delegation not possible...',
        helpText: 'Delegate access to corey@clixsy.com. Provide login details if delegation is not possible.'
      },

      // DNS Access
      {
        name: 'dns_access_granted',
        label: 'DNS Access (e.g., Cloudflare)',
        type: 'textarea',
        placeholder: 'Confirm access granted or provide login details...',
        helpText: 'Add tempclixsyreports@gmail.com to your DNS provider.'
      },

      // Google Search Console
      {
        name: 'gsc_access_granted',
        label: 'Google Search Console (GSC)',
        type: 'textarea',
        placeholder: 'Confirm access granted...',
        helpText: 'Add tempclixsyreports@gmail.com as an Owner.'
      },

      // Google Analytics
      {
        name: 'ga_access_granted',
        label: 'Google Analytics',
        type: 'textarea',
        placeholder: 'Confirm access granted...',
        helpText: 'Add tempclixsyreports@gmail.com as an Owner.'
      },

      // Google Business Profile
      {
        name: 'gbp_access_granted',
        label: 'Google Business Profile (GBP)',
        type: 'textarea',
        placeholder: 'Confirm access granted...',
        helpText: 'Add tempclixsyreports@gmail.com as an Owner for all managed profiles.'
      },

      // Video Hosting
      {
        name: 'youtube_access_granted',
        label: 'YouTube Access',
        type: 'textarea',
        placeholder: 'Confirm access granted...',
        helpText: 'Add tempclixsyreports@gmail.com as a Manager.'
      },
      {
        name: 'other_video_platforms',
        label: 'Other Video Platforms (Wistia, Vimeo)',
        type: 'textarea',
        placeholder: 'Provide login details for Wistia, Vimeo, etc.'
      },

      // Local Services Ads
      {
        name: 'lsa_customer_ids',
        label: 'Local Services Ads (LSA) - Customer ID(s)',
        type: 'textarea',
        helpText: 'Provide your Customer ID Number(s) (CIDs) so our team can send an access request.'
      },

      // Other Credentials
      {
        name: 'other_account_credentials',
        label: 'Other Account Credentials',
        type: 'textarea',
        helpText: 'List any additional credentials (social media, advertising platforms, etc.) relevant to the campaign.'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 11: WELCOME GIFTS & LOGISTICS
  // -----------------------------------------------
  {
    key: 'welcome_gifts',
    title: 'Welcome Gifts & Logistics',
    shortTitle: 'GIFTS',
    description: 'Help us send a welcome gift to your team.',
    estimatedTime: '2 min',
    fields: [
      // Office/Team Gift
      {
        name: 'office_gift_recipient',
        label: 'Office/Team Gift - Recipient Name',
        type: 'text'
      },
      {
        name: 'office_gift_address',
        label: 'Office/Team Gift - Shipping Address',
        type: 'textarea'
      },

      // Individual Gift
      {
        name: 'individual_gift_recipient',
        label: 'Individual Gift - Recipient Name',
        type: 'text'
      },
      {
        name: 'individual_gift_address',
        label: 'Individual Gift - Shipping Address',
        type: 'textarea'
      },

      // Shipping Preference
      {
        name: 'shipping_preference',
        label: 'Should we delay shipment for any reason?',
        type: 'textarea',
        placeholder: 'e.g., Wait until after Dec 15, Office closed next week'
      },
    ]
  },

  // -----------------------------------------------
  // SECTION 12: REVIEW & SUBMIT
  // -----------------------------------------------
  {
    key: 'final_review',
    title: 'Review & Submit',
    shortTitle: 'FINISH',
    description: 'Review your information and schedule your onboarding call.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'confirm_accuracy',
        label: 'I confirm that the information provided is accurate to the best of my knowledge',
        type: 'checkbox',
        required: true
      },
      {
        name: 'confirm_proceed',
        label: 'I authorize Clixsy to proceed with the marketing setup based on this information',
        type: 'checkbox',
        required: true
      },
      {
        name: 'additional_notes',
        label: 'Additional Notes or Questions',
        type: 'textarea',
        placeholder: 'Anything else you\'d like us to know before your onboarding call?'
      },
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
  contact_information: z.object({
    main_contact_name: z.string().min(1, 'Main contact name is required'),
    main_contact_title: z.string().min(1, 'Title/Role is required'),
    main_contact_email: z.string().email('Please enter a valid email'),
    main_contact_phone: z.string().min(1, 'Contact phone is required'),
    secondary_contact_name: optionalString,
    secondary_contact_email: optionalEmail,
    secondary_contact_phone: optionalString,
    tech_contact_name: optionalString,
    tech_contact_email: optionalEmail,
    tech_contact_phone: optionalString,
    previous_agency_contact: optionalString,
  }),

  business_profile: z.object({
    business_name: z.string().min(1, 'Business name is required'),
    website_url: z.string().url('Please enter a valid URL'),
    owner_names: optionalString,
    physical_address: z.string().min(1, 'Physical address is required'),
    move_in_date: optionalString,
    business_phone: z.string().min(1, 'Business phone is required'),
    year_founded: optionalString,
    languages_spoken: optionalString,
    owner_license_number: optionalString,
    license_issue_date: optionalString,
    ein_number: optionalString,
  }),

  vision_strategy: z.object({
    success_definition: z.string().min(1, 'Please define what success looks like'),
    magic_wand_outcome: optionalString,
    current_challenges: optionalString,
    key_performance_indicators: optionalString,
  }),

  company_identity: z.object({
    brand_style_guide_url: optionalUrl,
    logo_package_url: optionalUrl,
    typography_fonts: optionalString,
    primary_color: optionalString,
    secondary_color: optionalString,
    additional_colors: optionalString,
  }),

  technical_assets: z.object({
    owns_domain: z.string().min(1, 'Please indicate domain ownership'),
    controls_dns: optionalString,
    other_domains: optionalString,
    is_wordpress: optionalString,
    website_platform_other: optionalString,
    owns_written_content: optionalString,
    has_imagery_licenses: optionalString,
    anti_spam_adequate: optionalString,
    form_submission_destinations: optionalString,
    uses_call_tracking: optionalString,
    call_tracking_provider: optionalString,
    call_tracking_ownership: optionalString,
    can_remove_agency_access: optionalString,
    agencies_to_remove: optionalString,
  }),

  seo_targets: z.object({
    main_geographical_areas: z.string().min(1, 'Please specify target geographical areas'),
    primary_case_types_keywords: z.string().min(1, 'Please list primary case types and keywords'),
    initial_focus_areas: optionalString,
    secondary_gbp_locations: optionalString,
    attorney_imagery_lsa: optionalUrl,
    additional_campaign_info: optionalString,
  }),

  google_business_profile: z.object({
    has_gbp: z.string().min(1, 'Please indicate GBP status'),
    gbp_listing_url: optionalUrl,
    gbp_primary_category: optionalString,
    gbp_secondary_categories: optionalString,
    current_review_count: optionalString,
    current_rating: optionalString,
    nap_consistency: optionalString,
    gbp_photos_available: optionalString,
  }),

  legal_compliance: z.object({
    advertising_regulations: optionalString,
    legal_disclaimers: optionalString,
    words_phrases_to_avoid: optionalString,
    imagery_to_avoid: optionalString,
    topics_to_avoid: optionalString,
    content_approval_required: optionalString,
  }),

  communication_preferences: z.object({
    additional_report_recipients: optionalString,
    missed_call_preference: optionalString,
    call_frequency_preference: optionalString,
  }),

  technical_access: z.object({
    wordpress_access_granted: optionalString,
    domain_registrar_access: optionalString,
    dns_access_granted: optionalString,
    gsc_access_granted: optionalString,
    ga_access_granted: optionalString,
    gbp_access_granted: optionalString,
    youtube_access_granted: optionalString,
    other_video_platforms: optionalString,
    lsa_customer_ids: optionalString,
    other_account_credentials: optionalString,
  }),

  welcome_gifts: z.object({
    office_gift_recipient: optionalString,
    office_gift_address: optionalString,
    individual_gift_recipient: optionalString,
    individual_gift_address: optionalString,
    shipping_preference: optionalString,
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
