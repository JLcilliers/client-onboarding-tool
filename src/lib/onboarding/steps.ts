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
  isReviewStep?: boolean; // For the "Almost There" step
}

// =============================================
// STEP DEFINITIONS - Reorganized for minimal scrolling
// =============================================

export const onboardingSteps: OnboardingStep[] = [
  // -----------------------------------------------
  // STEP 1: PRIMARY CONTACT
  // -----------------------------------------------
  {
    key: 'primary_contact',
    title: 'Primary Contact',
    shortTitle: 'PRIMARY',
    description: 'Who is the main decision maker for this project?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'main_contact_name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'John Smith',
        helpText: 'This should be the person with ultimate authority over the project.'
      },
      {
        name: 'main_contact_title',
        label: 'Title/Role',
        type: 'select',
        required: true,
        options: [
          { value: 'owner', label: 'Owner / Managing Partner' },
          { value: 'partner', label: 'Partner' },
          { value: 'marketing_director', label: 'Marketing Director' },
          { value: 'office_manager', label: 'Office Manager' },
          { value: 'other', label: 'Other' }
        ]
      },
      { name: 'main_contact_email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@example.com' },
      { name: 'main_contact_phone', label: 'Best Contact Number', type: 'tel', required: true, placeholder: '(555) 123-4567' },
    ]
  },

  // -----------------------------------------------
  // STEP 2: ADDITIONAL CONTACTS
  // -----------------------------------------------
  {
    key: 'additional_contacts',
    title: 'Additional Contacts',
    shortTitle: 'CONTACTS',
    description: 'Who else should we contact for day-to-day matters or technical questions?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'has_secondary_contact',
        label: 'Do you have a secondary contact for day-to-day matters?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No, primary contact handles everything' }
        ]
      },
      {
        name: 'secondary_contact_name',
        label: 'Secondary Contact - Full Name',
        type: 'text',
        dependsOn: { field: 'has_secondary_contact', value: 'yes' }
      },
      {
        name: 'secondary_contact_email',
        label: 'Secondary Contact - Email',
        type: 'email',
        dependsOn: { field: 'has_secondary_contact', value: 'yes' }
      },
      {
        name: 'secondary_contact_phone',
        label: 'Secondary Contact - Phone',
        type: 'tel',
        dependsOn: { field: 'has_secondary_contact', value: 'yes' }
      },
    ]
  },

  // -----------------------------------------------
  // STEP 3: TECHNICAL CONTACT
  // -----------------------------------------------
  {
    key: 'tech_contact',
    title: 'Technical Contact',
    shortTitle: 'TECH',
    description: 'Who handles technical or IT-related matters?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'has_tech_contact',
        label: 'Do you have a dedicated technical/IT contact?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes, we have a dedicated IT person' },
          { value: 'external', label: 'Yes, we use an external IT company' },
          { value: 'no', label: 'No, primary contact handles IT matters' }
        ]
      },
      {
        name: 'tech_contact_name',
        label: 'Technical Contact - Full Name',
        type: 'text',
        dependsOn: { field: 'has_tech_contact', value: 'yes' }
      },
      {
        name: 'tech_contact_email',
        label: 'Technical Contact - Email',
        type: 'email',
        dependsOn: { field: 'has_tech_contact', value: 'yes' }
      },
      {
        name: 'external_it_company',
        label: 'IT Company Name & Contact',
        type: 'textarea',
        placeholder: 'Company name, contact person, email, phone',
        dependsOn: { field: 'has_tech_contact', value: 'external' }
      },
    ]
  },

  // -----------------------------------------------
  // STEP 4: BUSINESS BASICS
  // -----------------------------------------------
  {
    key: 'business_basics',
    title: 'Business Basics',
    shortTitle: 'BUSINESS',
    description: 'Tell us about your business.',
    estimatedTime: '2 min',
    fields: [
      { name: 'business_name', label: 'Business Name', type: 'text', required: true, placeholder: 'Smith & Associates Law Firm' },
      { name: 'website_url', label: 'Main Website URL', type: 'url', required: true, placeholder: 'https://example.com' },
      { name: 'business_phone', label: 'Main Business Phone', type: 'tel', required: true, placeholder: '(555) 123-4567' },
      {
        name: 'year_founded',
        label: 'When was your firm founded?',
        type: 'select',
        options: [
          { value: '2020s', label: '2020 or later' },
          { value: '2010s', label: '2010-2019' },
          { value: '2000s', label: '2000-2009' },
          { value: '1990s', label: '1990-1999' },
          { value: 'before_1990', label: 'Before 1990' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 5: BUSINESS LOCATION
  // -----------------------------------------------
  {
    key: 'business_location',
    title: 'Business Location',
    shortTitle: 'LOCATION',
    description: 'Where is your business located?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'physical_address',
        label: 'Physical Company Address',
        type: 'textarea',
        required: true,
        placeholder: '123 Main Street, Suite 100\nCity, State 12345',
        helpText: 'Provide the exact address as it appears on your Google Business Profile.'
      },
      {
        name: 'location_type',
        label: 'What type of location is this?',
        type: 'radio',
        options: [
          { value: 'owned', label: 'We own this property' },
          { value: 'leased', label: 'We lease this space' },
          { value: 'virtual', label: 'Virtual office' },
          { value: 'coworking', label: 'Coworking space' }
        ]
      },
      {
        name: 'how_long_at_location',
        label: 'How long have you been at this location?',
        type: 'select',
        options: [
          { value: 'less_than_1', label: 'Less than 1 year' },
          { value: '1_to_3', label: '1-3 years' },
          { value: '3_to_5', label: '3-5 years' },
          { value: '5_to_10', label: '5-10 years' },
          { value: 'more_than_10', label: 'More than 10 years' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 6: BUSINESS DETAILS
  // -----------------------------------------------
  {
    key: 'business_details',
    title: 'Business Details',
    shortTitle: 'DETAILS',
    description: 'A few more details about your business.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'languages_spoken',
        label: 'What languages are spoken at your firm?',
        type: 'multiselect',
        options: [
          { value: 'english', label: 'English' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'chinese', label: 'Chinese (Mandarin/Cantonese)' },
          { value: 'vietnamese', label: 'Vietnamese' },
          { value: 'korean', label: 'Korean' },
          { value: 'tagalog', label: 'Tagalog' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        name: 'owner_names',
        label: 'Owner/Main Partner(s) Names',
        type: 'textarea',
        placeholder: 'List all owners/partners, one per line'
      },
      {
        name: 'firm_size',
        label: 'How many people work at your firm?',
        type: 'select',
        options: [
          { value: 'solo', label: 'Solo practitioner' },
          { value: '2_5', label: '2-5 employees' },
          { value: '6_10', label: '6-10 employees' },
          { value: '11_25', label: '11-25 employees' },
          { value: '26_50', label: '26-50 employees' },
          { value: '50_plus', label: 'More than 50 employees' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 7: VISION & GOALS
  // -----------------------------------------------
  {
    key: 'vision_goals',
    title: 'Vision & Goals',
    shortTitle: 'VISION',
    description: 'Help us understand what success looks like for you.',
    estimatedTime: '3 min',
    fields: [
      {
        name: 'primary_goal',
        label: 'What is your #1 goal for working with us?',
        type: 'radio',
        required: true,
        options: [
          { value: 'more_leads', label: 'Get more leads/clients' },
          { value: 'better_quality', label: 'Get better quality leads' },
          { value: 'brand_awareness', label: 'Increase brand awareness' },
          { value: 'competitive', label: 'Stay competitive with other firms' },
          { value: 'all_above', label: 'All of the above' }
        ]
      },
      {
        name: 'success_definition',
        label: 'What would make this engagement a success in 12 months?',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., "I want to see 20% more qualified leads coming through our website"'
      },
      {
        name: 'current_challenges',
        label: 'What is your biggest marketing challenge right now?',
        type: 'textarea',
        placeholder: 'e.g., "We don\'t show up on Google when people search for our services"'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 8: SUCCESS METRICS
  // -----------------------------------------------
  {
    key: 'success_metrics',
    title: 'Success Metrics',
    shortTitle: 'METRICS',
    description: 'How do you measure success?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'key_performance_indicators',
        label: 'Which metrics matter most to you?',
        type: 'multiselect',
        options: [
          { value: 'website_traffic', label: 'Website traffic' },
          { value: 'phone_calls', label: 'Phone calls' },
          { value: 'form_submissions', label: 'Form submissions' },
          { value: 'signed_clients', label: 'Signed clients' },
          { value: 'google_rankings', label: 'Google rankings' },
          { value: 'google_reviews', label: 'Google reviews' },
          { value: 'revenue', label: 'Revenue growth' }
        ]
      },
      {
        name: 'current_lead_volume',
        label: 'How many leads do you currently get per month?',
        type: 'select',
        options: [
          { value: 'less_than_10', label: 'Less than 10' },
          { value: '10_25', label: '10-25' },
          { value: '26_50', label: '26-50' },
          { value: '51_100', label: '51-100' },
          { value: 'more_than_100', label: 'More than 100' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'target_lead_volume',
        label: 'How many leads would you like to get per month?',
        type: 'select',
        options: [
          { value: '10_25', label: '10-25' },
          { value: '26_50', label: '26-50' },
          { value: '51_100', label: '51-100' },
          { value: '101_200', label: '101-200' },
          { value: 'more_than_200', label: 'More than 200' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 9: BRAND ASSETS
  // -----------------------------------------------
  {
    key: 'brand_assets',
    title: 'Brand Assets',
    shortTitle: 'BRAND',
    description: 'Help us maintain your visual identity.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'has_brand_guide',
        label: 'Do you have a brand style guide?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes, we have a style guide' },
          { value: 'partial', label: 'We have some guidelines but not a full guide' },
          { value: 'no', label: 'No, we don\'t have one' }
        ]
      },
      {
        name: 'brand_style_guide_url',
        label: 'Link to your brand style guide',
        type: 'url',
        placeholder: 'https://...',
        dependsOn: { field: 'has_brand_guide', value: 'yes' }
      },
      {
        name: 'has_logo_files',
        label: 'Do you have high-quality logo files?',
        type: 'radio',
        options: [
          { value: 'yes_vector', label: 'Yes, vector files (AI, EPS, SVG)' },
          { value: 'yes_png', label: 'Yes, but only PNG/JPG' },
          { value: 'no', label: 'No / Not sure' }
        ]
      },
      {
        name: 'logo_package_url',
        label: 'Link to your logo files',
        type: 'url',
        placeholder: 'Google Drive, Dropbox, etc.',
        dependsOn: { field: 'has_logo_files', value: 'yes_vector' }
      },
    ]
  },

  // -----------------------------------------------
  // STEP 10: BRAND COLORS
  // -----------------------------------------------
  {
    key: 'brand_colors',
    title: 'Brand Colors & Fonts',
    shortTitle: 'COLORS',
    description: 'What are your brand colors and fonts?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'knows_brand_colors',
        label: 'Do you know your brand color hex codes?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes, I know them' },
          { value: 'no', label: 'No, please pull them from our website' }
        ]
      },
      {
        name: 'primary_color',
        label: 'Primary Brand Color (Hex)',
        type: 'text',
        placeholder: '#000000',
        dependsOn: { field: 'knows_brand_colors', value: 'yes' }
      },
      {
        name: 'secondary_color',
        label: 'Secondary Brand Color (Hex)',
        type: 'text',
        placeholder: '#000000',
        dependsOn: { field: 'knows_brand_colors', value: 'yes' }
      },
      {
        name: 'typography_fonts',
        label: 'What fonts do you use?',
        type: 'text',
        placeholder: 'e.g., Montserrat (Headers), Open Sans (Body)'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 11: DOMAIN & WEBSITE
  // -----------------------------------------------
  {
    key: 'domain_website',
    title: 'Domain & Website',
    shortTitle: 'DOMAIN',
    description: 'Tell us about your domain and website setup.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'owns_domain',
        label: 'Do you own your domain name?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes, we own it' },
          { value: 'no', label: 'No, someone else owns it' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'domain_registrar',
        label: 'Where is your domain registered?',
        type: 'select',
        options: [
          { value: 'godaddy', label: 'GoDaddy' },
          { value: 'namecheap', label: 'Namecheap' },
          { value: 'google_domains', label: 'Google Domains / Squarespace' },
          { value: 'cloudflare', label: 'Cloudflare' },
          { value: 'network_solutions', label: 'Network Solutions' },
          { value: 'other', label: 'Other / Not sure' }
        ]
      },
      {
        name: 'controls_dns',
        label: 'Do you have access to your DNS settings?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 12: WEBSITE PLATFORM
  // -----------------------------------------------
  {
    key: 'website_platform',
    title: 'Website Platform',
    shortTitle: 'PLATFORM',
    description: 'What platform is your website built on?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'website_platform',
        label: 'What platform is your website built on?',
        type: 'radio',
        options: [
          { value: 'wordpress', label: 'WordPress' },
          { value: 'squarespace', label: 'Squarespace' },
          { value: 'wix', label: 'Wix' },
          { value: 'webflow', label: 'Webflow' },
          { value: 'custom', label: 'Custom built' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'has_wordpress_access',
        label: 'Do you have WordPress admin access?',
        type: 'radio',
        dependsOn: { field: 'website_platform', value: 'wordpress' },
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'website_managed_by',
        label: 'Who currently manages your website?',
        type: 'radio',
        options: [
          { value: 'internal', label: 'We manage it internally' },
          { value: 'agency', label: 'Another agency manages it' },
          { value: 'freelancer', label: 'A freelancer manages it' },
          { value: 'no_one', label: 'No one actively manages it' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 13: LEAD TRACKING
  // -----------------------------------------------
  {
    key: 'lead_tracking',
    title: 'Lead Tracking',
    shortTitle: 'TRACKING',
    description: 'How do you track leads?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'uses_call_tracking',
        label: 'Do you use call tracking?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'call_tracking_provider',
        label: 'Which call tracking provider?',
        type: 'select',
        dependsOn: { field: 'uses_call_tracking', value: 'yes' },
        options: [
          { value: 'callrail', label: 'CallRail' },
          { value: 'calltrackingmetrics', label: 'CallTrackingMetrics' },
          { value: 'marchex', label: 'Marchex' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        name: 'form_submission_destinations',
        label: 'Where should form submissions be sent?',
        type: 'textarea',
        placeholder: 'Email addresses or intake software names',
        helpText: 'List all email addresses or software where form submissions should go.'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 14: SEO TARGET AREAS
  // -----------------------------------------------
  {
    key: 'seo_areas',
    title: 'Target Areas',
    shortTitle: 'AREAS',
    description: 'Where do you want to be found?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'service_area_type',
        label: 'What is your service area?',
        type: 'radio',
        required: true,
        options: [
          { value: 'local', label: 'Local (one city/metro area)' },
          { value: 'regional', label: 'Regional (multiple cities/counties)' },
          { value: 'statewide', label: 'Statewide' },
          { value: 'national', label: 'National' }
        ]
      },
      {
        name: 'main_geographical_areas',
        label: 'List your target cities/areas',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Los Angeles, Orange County, San Diego',
        helpText: 'List the cities, regions, or states you want to target.'
      },
      {
        name: 'has_multiple_locations',
        label: 'Do you have multiple office locations?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No, just one location' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 15: SEO CASE TYPES
  // -----------------------------------------------
  {
    key: 'seo_cases',
    title: 'Case Types & Keywords',
    shortTitle: 'CASES',
    description: 'What services should we focus on?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'primary_case_types_keywords',
        label: 'What are your primary case types?',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Personal injury, car accidents, slip and fall',
        helpText: 'List the case types most important to your business.'
      },
      {
        name: 'case_priority',
        label: 'Which case type should we focus on first?',
        type: 'text',
        placeholder: 'e.g., Car accidents'
      },
      {
        name: 'cases_to_avoid',
        label: 'Are there any case types you do NOT want?',
        type: 'textarea',
        placeholder: 'e.g., We don\'t handle criminal cases'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 16: GOOGLE BUSINESS PROFILE
  // -----------------------------------------------
  {
    key: 'google_business',
    title: 'Google Business Profile',
    shortTitle: 'GBP',
    description: 'Tell us about your Google Business Profile.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'has_gbp',
        label: 'Do you have a Google Business Profile?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'gbp_listing_url',
        label: 'Google Business Profile URL',
        type: 'url',
        placeholder: 'https://g.page/...',
        dependsOn: { field: 'has_gbp', value: 'yes' }
      },
      {
        name: 'current_review_count',
        label: 'Approximately how many Google reviews do you have?',
        type: 'select',
        dependsOn: { field: 'has_gbp', value: 'yes' },
        options: [
          { value: '0_10', label: '0-10 reviews' },
          { value: '11_25', label: '11-25 reviews' },
          { value: '26_50', label: '26-50 reviews' },
          { value: '51_100', label: '51-100 reviews' },
          { value: '100_plus', label: 'More than 100 reviews' }
        ]
      },
      {
        name: 'current_rating',
        label: 'What is your current star rating?',
        type: 'select',
        dependsOn: { field: 'has_gbp', value: 'yes' },
        options: [
          { value: '5', label: '5 stars' },
          { value: '4.5_5', label: '4.5-5 stars' },
          { value: '4_4.5', label: '4-4.5 stars' },
          { value: 'below_4', label: 'Below 4 stars' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 17: LEGAL & COMPLIANCE
  // -----------------------------------------------
  {
    key: 'legal_compliance',
    title: 'Legal & Compliance',
    shortTitle: 'LEGAL',
    description: 'Any advertising restrictions we should know about?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'has_advertising_restrictions',
        label: 'Does your state have special advertising rules?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'advertising_regulations',
        label: 'What restrictions apply?',
        type: 'textarea',
        placeholder: 'e.g., Must include disclaimer, can\'t use certain terms',
        dependsOn: { field: 'has_advertising_restrictions', value: 'yes' }
      },
      {
        name: 'legal_disclaimers',
        label: 'Do you have required legal disclaimers?',
        type: 'textarea',
        placeholder: 'Paste any required disclaimer text here'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 18: CONTENT PREFERENCES
  // -----------------------------------------------
  {
    key: 'content_preferences',
    title: 'Content Preferences',
    shortTitle: 'CONTENT',
    description: 'How involved do you want to be with content?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'content_approval_required',
        label: 'Would you like to approve content before publishing?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes, approve everything' },
          { value: 'major_only', label: 'Only major pieces (blogs, landing pages)' },
          { value: 'no', label: 'No, I trust your judgment' }
        ]
      },
      {
        name: 'words_phrases_to_avoid',
        label: 'Any words or phrases we should avoid?',
        type: 'textarea',
        placeholder: 'e.g., "Aggressive", "Win your case guaranteed"'
      },
      {
        name: 'topics_to_avoid',
        label: 'Any topics we should avoid?',
        type: 'textarea',
        placeholder: 'e.g., Don\'t discuss specific settlement amounts'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 19: COMMUNICATION PREFERENCES
  // -----------------------------------------------
  {
    key: 'communication',
    title: 'Communication',
    shortTitle: 'COMMS',
    description: 'How do you prefer to communicate?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'preferred_communication',
        label: 'Preferred communication method',
        type: 'radio',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone calls' },
          { value: 'text', label: 'Text messages' },
          { value: 'slack', label: 'Slack / Teams' }
        ]
      },
      {
        name: 'call_frequency_preference',
        label: 'How often would you like to meet?',
        type: 'radio',
        options: [
          { value: 'weekly', label: 'Weekly calls' },
          { value: 'biweekly', label: 'Every two weeks' },
          { value: 'monthly', label: 'Monthly calls' },
          { value: 'quarterly', label: 'Quarterly calls with video updates' }
        ]
      },
      {
        name: 'additional_report_recipients',
        label: 'Who else should receive reports?',
        type: 'textarea',
        placeholder: 'Name and email for each person',
        helpText: 'List anyone else who should receive monthly reports.'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 20: GOOGLE ACCESS
  // -----------------------------------------------
  {
    key: 'google_access',
    title: 'Google Access',
    shortTitle: 'GOOGLE',
    description: 'Grant us access to your Google accounts.',
    estimatedTime: '3 min',
    fields: [
      {
        name: 'has_google_analytics',
        label: 'Do you have Google Analytics set up?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'ga_access_granted',
        label: 'Google Analytics access status',
        type: 'radio',
        dependsOn: { field: 'has_google_analytics', value: 'yes' },
        options: [
          { value: 'granted', label: 'I\'ve added tempclixsyreports@gmail.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' }
        ],
        helpText: 'Add tempclixsyreports@gmail.com as an Editor.'
      },
      {
        name: 'gsc_access_granted',
        label: 'Google Search Console access status',
        type: 'radio',
        options: [
          { value: 'granted', label: 'I\'ve added tempclixsyreports@gmail.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' },
          { value: 'not_setup', label: 'Not set up yet' }
        ],
        helpText: 'Add tempclixsyreports@gmail.com as an Owner.'
      },
      {
        name: 'gbp_access_granted',
        label: 'Google Business Profile access status',
        type: 'radio',
        options: [
          { value: 'granted', label: 'I\'ve added tempclixsyreports@gmail.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' },
          { value: 'no_gbp', label: 'I don\'t have a GBP' }
        ],
        helpText: 'Add tempclixsyreports@gmail.com as a Manager.'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 21: WEBSITE ACCESS
  // -----------------------------------------------
  {
    key: 'website_access',
    title: 'Website Access',
    shortTitle: 'ACCESS',
    description: 'Grant us access to your website.',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'wordpress_access_granted',
        label: 'WordPress Admin access status',
        type: 'radio',
        options: [
          { value: 'granted', label: 'I\'ve created a user for keith@clixsy.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' },
          { value: 'not_wordpress', label: 'My site isn\'t WordPress' }
        ],
        helpText: 'Create an Administrator account for keith@clixsy.com'
      },
      {
        name: 'domain_registrar_access',
        label: 'Domain registrar access status',
        type: 'radio',
        options: [
          { value: 'granted', label: 'I\'ve granted access to corey@clixsy.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' },
          { value: 'will_share_login', label: 'I\'ll share login details separately' }
        ],
        helpText: 'Delegate access or share login details for domain management.'
      },
      {
        name: 'dns_access_granted',
        label: 'DNS access status',
        type: 'radio',
        options: [
          { value: 'granted', label: 'I\'ve added tempclixsyreports@gmail.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' },
          { value: 'same_as_domain', label: 'Same as domain registrar' }
        ],
        helpText: 'Add tempclixsyreports@gmail.com to your DNS provider (e.g., Cloudflare).'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 22: OTHER ACCESS
  // -----------------------------------------------
  {
    key: 'other_access',
    title: 'Other Access',
    shortTitle: 'OTHER',
    description: 'Any other accounts we should have access to?',
    estimatedTime: '2 min',
    fields: [
      {
        name: 'has_youtube',
        label: 'Do you have a YouTube channel?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        name: 'youtube_access_granted',
        label: 'YouTube access status',
        type: 'radio',
        dependsOn: { field: 'has_youtube', value: 'yes' },
        options: [
          { value: 'granted', label: 'I\'ve added tempclixsyreports@gmail.com' },
          { value: 'will_do', label: 'I\'ll do this after' },
          { value: 'need_help', label: 'I need help with this' }
        ]
      },
      {
        name: 'has_lsa',
        label: 'Do you have Local Services Ads (LSA)?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_sure', label: 'Not sure' }
        ]
      },
      {
        name: 'lsa_customer_ids',
        label: 'LSA Customer ID(s)',
        type: 'text',
        placeholder: 'Your LSA Customer ID number',
        dependsOn: { field: 'has_lsa', value: 'yes' },
        helpText: 'Provide your Customer ID so we can send an access request.'
      },
    ]
  },

  // -----------------------------------------------
  // STEP 23: PREVIOUS AGENCY
  // -----------------------------------------------
  {
    key: 'previous_agency',
    title: 'Previous Agency',
    shortTitle: 'PREV',
    description: 'Are you transitioning from another agency?',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'has_previous_agency',
        label: 'Were you working with another marketing agency?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        name: 'previous_agency_contact',
        label: 'Previous agency contact info',
        type: 'textarea',
        placeholder: 'Agency name, contact person, email, phone',
        dependsOn: { field: 'has_previous_agency', value: 'yes' },
        helpText: 'We may need to coordinate the transition with them.'
      },
      {
        name: 'can_remove_agency_access',
        label: 'Can we remove their access to your accounts?',
        type: 'radio',
        dependsOn: { field: 'has_previous_agency', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes, please remove their access' },
          { value: 'no', label: 'No, I\'ll handle that myself' },
          { value: 'wait', label: 'Wait until transition is complete' }
        ]
      },
    ]
  },

  // -----------------------------------------------
  // STEP 24: WELCOME GIFT
  // -----------------------------------------------
  {
    key: 'welcome_gift',
    title: 'Welcome Gift',
    shortTitle: 'GIFT',
    description: 'We\'d love to send you a welcome gift!',
    estimatedTime: '1 min',
    fields: [
      {
        name: 'wants_welcome_gift',
        label: 'Would you like to receive a welcome gift?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes, please!' },
          { value: 'no', label: 'No, thank you' }
        ]
      },
      {
        name: 'gift_recipient_name',
        label: 'Recipient Name',
        type: 'text',
        dependsOn: { field: 'wants_welcome_gift', value: 'yes' }
      },
      {
        name: 'gift_shipping_address',
        label: 'Shipping Address',
        type: 'textarea',
        placeholder: 'Full shipping address',
        dependsOn: { field: 'wants_welcome_gift', value: 'yes' }
      },
      {
        name: 'shipping_preference',
        label: 'Any shipping instructions?',
        type: 'textarea',
        placeholder: 'e.g., Wait until after Dec 15',
        dependsOn: { field: 'wants_welcome_gift', value: 'yes' }
      },
    ]
  },

  // -----------------------------------------------
  // STEP 25: ALMOST THERE (Review Missing Items)
  // -----------------------------------------------
  {
    key: 'almost_there',
    title: 'Almost There!',
    shortTitle: 'REVIEW',
    description: 'Let\'s make sure we have everything we need.',
    estimatedTime: '2 min',
    isReviewStep: true,
    fields: [] // This step will dynamically show missing fields
  },

  // -----------------------------------------------
  // STEP 26: FINAL CONFIRMATION
  // -----------------------------------------------
  {
    key: 'final_review',
    title: 'Ready to Submit',
    shortTitle: 'SUBMIT',
    description: 'Confirm and submit your onboarding.',
    estimatedTime: '1 min',
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
        label: 'Anything else you\'d like us to know?',
        type: 'textarea',
        placeholder: 'Questions, concerns, or additional information'
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
  primary_contact: z.object({
    main_contact_name: z.string().min(1, 'Full name is required'),
    main_contact_title: z.string().min(1, 'Title/Role is required'),
    main_contact_email: z.string().email('Please enter a valid email'),
    main_contact_phone: z.string().min(1, 'Phone number is required'),
  }),

  additional_contacts: z.object({
    has_secondary_contact: optionalString,
    secondary_contact_name: optionalString,
    secondary_contact_email: optionalEmail,
    secondary_contact_phone: optionalString,
  }),

  tech_contact: z.object({
    has_tech_contact: optionalString,
    tech_contact_name: optionalString,
    tech_contact_email: optionalEmail,
    external_it_company: optionalString,
  }),

  business_basics: z.object({
    business_name: z.string().min(1, 'Business name is required'),
    website_url: z.string().url('Please enter a valid URL'),
    business_phone: z.string().min(1, 'Business phone is required'),
    year_founded: optionalString,
  }),

  business_location: z.object({
    physical_address: z.string().min(1, 'Physical address is required'),
    location_type: optionalString,
    how_long_at_location: optionalString,
  }),

  business_details: z.object({
    languages_spoken: z.array(z.string()).optional(),
    owner_names: optionalString,
    firm_size: optionalString,
  }),

  vision_goals: z.object({
    primary_goal: z.string().min(1, 'Please select your primary goal'),
    success_definition: z.string().min(1, 'Please describe what success looks like'),
    current_challenges: optionalString,
  }),

  success_metrics: z.object({
    key_performance_indicators: z.array(z.string()).optional(),
    current_lead_volume: optionalString,
    target_lead_volume: optionalString,
  }),

  brand_assets: z.object({
    has_brand_guide: optionalString,
    brand_style_guide_url: optionalUrl,
    has_logo_files: optionalString,
    logo_package_url: optionalUrl,
  }),

  brand_colors: z.object({
    knows_brand_colors: optionalString,
    primary_color: optionalString,
    secondary_color: optionalString,
    typography_fonts: optionalString,
  }),

  domain_website: z.object({
    owns_domain: z.string().min(1, 'Please indicate domain ownership'),
    domain_registrar: optionalString,
    controls_dns: optionalString,
  }),

  website_platform: z.object({
    website_platform: optionalString,
    has_wordpress_access: optionalString,
    website_managed_by: optionalString,
  }),

  lead_tracking: z.object({
    uses_call_tracking: optionalString,
    call_tracking_provider: optionalString,
    form_submission_destinations: optionalString,
  }),

  seo_areas: z.object({
    service_area_type: z.string().min(1, 'Please select your service area type'),
    main_geographical_areas: z.string().min(1, 'Please list your target areas'),
    has_multiple_locations: optionalString,
  }),

  seo_cases: z.object({
    primary_case_types_keywords: z.string().min(1, 'Please list your primary case types'),
    case_priority: optionalString,
    cases_to_avoid: optionalString,
  }),

  google_business: z.object({
    has_gbp: z.string().min(1, 'Please indicate GBP status'),
    gbp_listing_url: optionalUrl,
    current_review_count: optionalString,
    current_rating: optionalString,
  }),

  legal_compliance: z.object({
    has_advertising_restrictions: optionalString,
    advertising_regulations: optionalString,
    legal_disclaimers: optionalString,
  }),

  content_preferences: z.object({
    content_approval_required: optionalString,
    words_phrases_to_avoid: optionalString,
    topics_to_avoid: optionalString,
  }),

  communication: z.object({
    preferred_communication: optionalString,
    call_frequency_preference: optionalString,
    additional_report_recipients: optionalString,
  }),

  google_access: z.object({
    has_google_analytics: optionalString,
    ga_access_granted: optionalString,
    gsc_access_granted: optionalString,
    gbp_access_granted: optionalString,
  }),

  website_access: z.object({
    wordpress_access_granted: optionalString,
    domain_registrar_access: optionalString,
    dns_access_granted: optionalString,
  }),

  other_access: z.object({
    has_youtube: optionalString,
    youtube_access_granted: optionalString,
    has_lsa: optionalString,
    lsa_customer_ids: optionalString,
  }),

  previous_agency: z.object({
    has_previous_agency: optionalString,
    previous_agency_contact: optionalString,
    can_remove_agency_access: optionalString,
  }),

  welcome_gift: z.object({
    wants_welcome_gift: optionalString,
    gift_recipient_name: optionalString,
    gift_shipping_address: optionalString,
    shipping_preference: optionalString,
  }),

  almost_there: z.object({}), // No validation needed, this is a review step

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

// Get all required fields across all steps
export function getAllRequiredFields(): { stepKey: string; stepTitle: string; fieldName: string; fieldLabel: string }[] {
  const requiredFields: { stepKey: string; stepTitle: string; fieldName: string; fieldLabel: string }[] = [];

  onboardingSteps.forEach(step => {
    step.fields.forEach(field => {
      if (field.required) {
        requiredFields.push({
          stepKey: step.key,
          stepTitle: step.title,
          fieldName: field.name,
          fieldLabel: field.label,
        });
      }
    });
  });

  return requiredFields;
}

// Get missing required fields based on current answers
export function getMissingRequiredFields(
  answers: Record<string, Record<string, unknown>>
): { stepKey: string; stepTitle: string; stepIndex: number; fieldName: string; fieldLabel: string }[] {
  const missing: { stepKey: string; stepTitle: string; stepIndex: number; fieldName: string; fieldLabel: string }[] = [];

  onboardingSteps.forEach((step, index) => {
    const stepAnswers = answers[step.key] || {};

    step.fields.forEach(field => {
      if (field.required) {
        const value = stepAnswers[field.name];
        const isEmpty = value === undefined || value === null || value === '' ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          missing.push({
            stepKey: step.key,
            stepTitle: step.title,
            stepIndex: index,
            fieldName: field.name,
            fieldLabel: field.label,
          });
        }
      }
    });
  });

  return missing;
}
