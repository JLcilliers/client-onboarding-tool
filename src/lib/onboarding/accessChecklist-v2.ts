// =============================================
// V2 ACCESS CHECKLIST COMPUTATION
// =============================================
// In v2, all access answers live under step key 'access_checklist'
// with _access_status field keys.

import { ACCESS_ITEMS, type AccessChecklist, type AccessItemStatus, type AnswersByStep, generateMissingAccessText } from './accessChecklist';

type AccessStatusValue = 'done' | 'later' | 'need_help' | 'not_applicable' | '';

const V2_ACCESS_FIELD_MAP: Record<string, string> = {
  ga: 'ga_access_status',
  gsc: 'gsc_access_status',
  gbp: 'gbp_access_status',
  wordpress: 'wordpress_access_status',
  domain: 'domain_access_status',
  dns: 'dns_access_status',
  youtube: 'youtube_access_status',
};

export function computeAccessChecklistV2(answersByStep: AnswersByStep): AccessChecklist {
  const checklistAnswers = answersByStep['access_checklist'] || {};

  const items: AccessItemStatus[] = ACCESS_ITEMS
    .filter(item => item.key !== 'lsa') // LSA deferred in v2
    .map(item => {
      const statusField = V2_ACCESS_FIELD_MAP[item.key];
      const statusValue = (checklistAnswers[statusField] as AccessStatusValue) || '';

      // Determine relevance
      let relevant = true;
      if (item.key === 'ga') {
        const hasGA = checklistAnswers['has_google_analytics'] as string;
        relevant = hasGA === 'yes' || hasGA === 'not_sure' || !hasGA;
      }
      if (item.key === 'youtube') {
        const hasYT = checklistAnswers['has_youtube'] as string;
        relevant = hasYT === 'yes';
      }

      // Not applicable counts as not relevant
      if (statusValue === 'not_applicable') {
        relevant = false;
      }

      // Provided = status is 'done'
      const provided = relevant && statusValue === 'done';

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
