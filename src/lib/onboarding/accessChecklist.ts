// =============================================
// ACCESS CHECKLIST DEFINITIONS
// =============================================
// Auto-generate a checklist of access requirements from onboarding answers

export type AccessKey = 'wordpress' | 'domain' | 'dns' | 'gsc' | 'ga' | 'gbp' | 'youtube' | 'lsa';

export interface AccessItem {
  key: AccessKey;
  label: string;
  shortLabel: string;
  description: string;
  whatWeNeed: string;
}

export interface AccessItemStatus extends AccessItem {
  provided: boolean;
  relevant: boolean;
}

export interface AccessChecklist {
  items: AccessItemStatus[];
  missingCount: number;
  presentCount: number;
  notApplicableCount: number;
  missingKeys: AccessKey[];
  presentKeys: AccessKey[];
  missingAccessText: string;
}

// Type for answers organized by step key
export type AnswersByStep = Record<string, Record<string, unknown>>;

// Helper functions to safely check answer values
function hasAnyString(answers: Record<string, unknown> | undefined, keys: string[]): boolean {
  if (!answers) return false;
  return keys.some(key => {
    const value = answers[key];
    return typeof value === 'string' && value.trim() !== '';
  });
}

function isTrue(answers: Record<string, unknown> | undefined, keys: string[]): boolean {
  if (!answers) return false;
  return keys.some(key => {
    const value = answers[key];
    return value === true || value === 'yes' || value === 'true';
  });
}

function hasValue(answers: Record<string, unknown> | undefined, key: string, targetValue: string): boolean {
  if (!answers) return false;
  const value = answers[key];
  return value === targetValue;
}

// =============================================
// ACCESS ITEM DEFINITIONS
// Based on Clixsy Technical Access requirements
// =============================================

export const ACCESS_ITEMS: AccessItem[] = [
  {
    key: 'wordpress',
    label: 'WordPress Admin',
    shortLabel: 'WP',
    description: 'WordPress Administrator access',
    whatWeNeed: 'Add keith@clixsy.com as an Administrator',
  },
  {
    key: 'domain',
    label: 'Domain Registrar',
    shortLabel: 'Domain',
    description: 'Domain registrar delegate access',
    whatWeNeed: 'Delegate access to corey@clixsy.com (e.g., GoDaddy)',
  },
  {
    key: 'dns',
    label: 'DNS Access',
    shortLabel: 'DNS',
    description: 'DNS provider access (e.g., Cloudflare)',
    whatWeNeed: 'Add tempclixsyreports@gmail.com to DNS provider',
  },
  {
    key: 'gsc',
    label: 'Google Search Console',
    shortLabel: 'GSC',
    description: 'Google Search Console Owner access',
    whatWeNeed: 'Add tempclixsyreports@gmail.com as an Owner',
  },
  {
    key: 'ga',
    label: 'Google Analytics',
    shortLabel: 'GA',
    description: 'Google Analytics Owner access',
    whatWeNeed: 'Add tempclixsyreports@gmail.com as an Owner',
  },
  {
    key: 'gbp',
    label: 'Google Business Profile',
    shortLabel: 'GBP',
    description: 'Google Business Profile Owner access',
    whatWeNeed: 'Add tempclixsyreports@gmail.com as an Owner',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    shortLabel: 'YT',
    description: 'YouTube channel Manager access',
    whatWeNeed: 'Add tempclixsyreports@gmail.com as a Manager',
  },
  {
    key: 'lsa',
    label: 'Local Services Ads',
    shortLabel: 'LSA',
    description: 'Local Services Ads Customer ID',
    whatWeNeed: 'Provide Customer ID Number(s) for LSA access request',
  },
];

// =============================================
// ACCESS CHECK FUNCTIONS
// =============================================

const accessCheckers: Record<AccessKey, {
  isRelevant: (answersByStep: AnswersByStep) => boolean;
  isProvided: (answersByStep: AnswersByStep) => boolean;
}> = {
  wordpress: {
    isRelevant: (answersByStep) => {
      const tech = answersByStep['technical_assets'];
      // Relevant if using WordPress
      if (!tech) return true; // Default to relevant
      return hasValue(tech, 'is_wordpress', 'yes') || hasValue(tech, 'is_wordpress', 'not_sure') || !tech['is_wordpress'];
    },
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['wordpress_access_granted']);
    },
  },
  domain: {
    isRelevant: (answersByStep) => {
      const tech = answersByStep['technical_assets'];
      // Relevant if they own their domain
      if (!tech) return true;
      return hasValue(tech, 'owns_domain', 'yes') || hasValue(tech, 'owns_domain', 'not_sure') || !tech['owns_domain'];
    },
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['domain_registrar_access']);
    },
  },
  dns: {
    isRelevant: (answersByStep) => {
      const tech = answersByStep['technical_assets'];
      // Relevant if they control DNS
      if (!tech) return true;
      return hasValue(tech, 'controls_dns', 'yes') || hasValue(tech, 'controls_dns', 'not_sure') || !tech['controls_dns'];
    },
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['dns_access_granted']);
    },
  },
  gsc: {
    isRelevant: () => true, // Always relevant
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['gsc_access_granted']);
    },
  },
  ga: {
    isRelevant: () => true, // Always relevant
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['ga_access_granted']);
    },
  },
  gbp: {
    isRelevant: (answersByStep) => {
      const gbp = answersByStep['google_business_profile'];
      // Relevant if they have a GBP
      if (!gbp) return true;
      return hasValue(gbp, 'has_gbp', 'yes') || hasValue(gbp, 'has_gbp', 'not_sure') || !gbp['has_gbp'];
    },
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['gbp_access_granted']);
    },
  },
  youtube: {
    isRelevant: () => false, // Optional - only relevant if they have YouTube content
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['youtube_access_granted', 'other_video_platforms']);
    },
  },
  lsa: {
    isRelevant: (answersByStep) => {
      const seo = answersByStep['seo_targets'];
      // Relevant if they provide attorney imagery for LSA
      return hasAnyString(seo, ['attorney_imagery_lsa']);
    },
    isProvided: (answersByStep) => {
      const access = answersByStep['technical_access'];
      return hasAnyString(access, ['lsa_customer_ids']);
    },
  },
};

// =============================================
// MAIN COMPUTATION FUNCTION
// =============================================

export function computeAccessChecklist(answersByStep: AnswersByStep): AccessChecklist {
  const items: AccessItemStatus[] = ACCESS_ITEMS.map(item => {
    const checker = accessCheckers[item.key];
    const relevant = checker.isRelevant(answersByStep);
    const provided = relevant ? checker.isProvided(answersByStep) : false;

    return {
      ...item,
      relevant,
      provided,
    };
  });

  const relevantItems = items.filter(item => item.relevant);
  const missingItems = relevantItems.filter(item => !item.provided);
  const presentItems = relevantItems.filter(item => item.provided);
  const notApplicableItems = items.filter(item => !item.relevant);

  const checklistBase = {
    items,
    missingCount: missingItems.length,
    presentCount: presentItems.length,
    notApplicableCount: notApplicableItems.length,
    missingKeys: missingItems.map(item => item.key),
    presentKeys: presentItems.map(item => item.key),
  };

  return {
    ...checklistBase,
    missingAccessText: generateMissingAccessText(checklistBase),
  };
}

// =============================================
// HELPER: Generate missing access request text
// =============================================

export function generateMissingAccessText(checklist: Omit<AccessChecklist, 'missingAccessText'>): string {
  const missingItems = checklist.items.filter(item => item.relevant && !item.provided);

  if (missingItems.length === 0) {
    return 'All required access has been provided.';
  }

  const itemsList = missingItems.map(item => `• ${item.label}`).join('\n');
  const whatWeNeedList = missingItems.map(item => `• ${item.whatWeNeed}`).join('\n');

  return `To complete the setup, we still need access to:\n\n${itemsList}\n\nSpecifically, please provide:\n\n${whatWeNeedList}`;
}

// Short version for quick copy
export function generateShortMissingAccessText(checklist: AccessChecklist): string {
  const missingItems = checklist.items.filter(item => item.relevant && !item.provided);

  if (missingItems.length === 0) {
    return 'All access provided.';
  }

  const labels = missingItems.map(item => item.label).join(', ');
  return `Missing access: ${labels}`;
}
