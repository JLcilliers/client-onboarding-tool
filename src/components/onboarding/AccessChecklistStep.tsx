'use client';

import { ACCESS_ITEMS } from '@/lib/onboarding/accessChecklist';

interface AccessChecklistStepProps {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (name: string, value: unknown) => void;
}

const ACCESS_STATUS_OPTIONS = [
  { value: 'done', label: 'Done — access granted' },
  { value: 'later', label: "I'll do this later" },
  { value: 'need_help', label: 'I need help' },
  { value: 'not_applicable', label: 'Not applicable' },
];

const YOUTUBE_STATUS_OPTIONS = [
  { value: 'done', label: 'Done — access granted' },
  { value: 'later', label: "I'll do this later" },
  { value: 'need_help', label: 'I need help' },
];

// Map access keys to v2 field keys and display config
const CHECKLIST_ROWS: {
  accessKey: string;
  statusField: string;
  label: string;
  whatWeNeed: string;
  gatedBy?: { field: string; value: string };
  statusOptions: { value: string; label: string }[];
}[] = (() => {
  // Filter out LSA (deferred in v2), build from ACCESS_ITEMS
  const items = ACCESS_ITEMS.filter(item => item.key !== 'lsa');
  return items.map(item => {
    const statusField = `${item.key === 'domain' ? 'domain' : item.key}_access_status`;
    let gatedBy: { field: string; value: string } | undefined;
    if (item.key === 'ga') gatedBy = { field: 'has_google_analytics', value: 'yes' };
    if (item.key === 'youtube') gatedBy = { field: 'has_youtube', value: 'yes' };
    return {
      accessKey: item.key,
      statusField,
      label: item.label,
      whatWeNeed: item.whatWeNeed,
      gatedBy,
      statusOptions: item.key === 'youtube' ? YOUTUBE_STATUS_OPTIONS : ACCESS_STATUS_OPTIONS,
    };
  });
})();

export default function AccessChecklistStep({ values, errors, onChange }: AccessChecklistStepProps) {
  const hasGA = values.has_google_analytics as string;
  const hasYT = values.has_youtube as string;

  return (
    <div className="space-y-6">
      {/* Gating questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Analytics gate */}
        <div>
          <label className="block text-sm font-medium text-[#0B0B0B] mb-2">
            Do you have Google Analytics set up?
          </label>
          <div className="flex gap-3">
            {[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'not_sure', label: 'Not sure' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('has_google_analytics', opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  hasGA === opt.value
                    ? 'bg-[#25DC7F]/10 border-[#25DC7F] text-[#0B0B0B]'
                    : 'border-[#E6E8EA] text-[#6B6B6B] hover:bg-[#F4F5F6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.has_google_analytics && (
            <p className="mt-1 text-sm text-[#E5484D]">{errors.has_google_analytics}</p>
          )}
        </div>

        {/* YouTube gate */}
        <div>
          <label className="block text-sm font-medium text-[#0B0B0B] mb-2">
            Do you have a YouTube channel?
          </label>
          <div className="flex gap-3">
            {[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('has_youtube', opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  hasYT === opt.value
                    ? 'bg-[#25DC7F]/10 border-[#25DC7F] text-[#0B0B0B]'
                    : 'border-[#E6E8EA] text-[#6B6B6B] hover:bg-[#F4F5F6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.has_youtube && (
            <p className="mt-1 text-sm text-[#E5484D]">{errors.has_youtube}</p>
          )}
        </div>
      </div>

      {/* Checklist table / cards */}
      <div className="border border-[#E6E8EA] rounded-xl overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden md:grid grid-cols-[1fr_1.5fr_200px] bg-[#F4F5F6] px-4 py-3 text-sm font-semibold text-[#6B6B6B]">
          <span>Service</span>
          <span>What We Need</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#E6E8EA]">
          {CHECKLIST_ROWS.map(row => {
            // Check gating
            if (row.gatedBy) {
              const gateValue = values[row.gatedBy.field] as string;
              if (gateValue !== row.gatedBy.value) return null;
            }

            const currentStatus = (values[row.statusField] as string) || '';

            return (
              <div key={row.accessKey}>
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[1fr_1.5fr_200px] items-center px-4 py-3 gap-4">
                  <div className="font-medium text-[#0B0B0B] text-sm">
                    {row.label}
                  </div>
                  <div className="text-sm text-[#6B6B6B]">
                    {row.whatWeNeed}
                  </div>
                  <div>
                    <select
                      value={currentStatus}
                      onChange={e => onChange(row.statusField, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                        currentStatus === 'done'
                          ? 'border-[#25DC7F] bg-[#25DC7F]/5 text-[#0B0B0B]'
                          : currentStatus === 'need_help'
                          ? 'border-[#F5A524] bg-[#F5A524]/5 text-[#0B0B0B]'
                          : 'border-[#E6E8EA] bg-white text-[#0B0B0B]'
                      }`}
                    >
                      <option value="">Select status...</option>
                      {row.statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mobile card */}
                <div className="md:hidden p-4 space-y-2">
                  <div className="font-medium text-[#0B0B0B] text-sm">
                    {row.label}
                  </div>
                  <div className="text-xs text-[#6B6B6B]">
                    {row.whatWeNeed}
                  </div>
                  <select
                    value={currentStatus}
                    onChange={e => onChange(row.statusField, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                      currentStatus === 'done'
                        ? 'border-[#25DC7F] bg-[#25DC7F]/5 text-[#0B0B0B]'
                        : currentStatus === 'need_help'
                        ? 'border-[#F5A524] bg-[#F5A524]/5 text-[#0B0B0B]'
                        : 'border-[#E6E8EA] bg-white text-[#0B0B0B]'
                    }`}
                  >
                    <option value="">Select status...</option>
                    {row.statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors[row.statusField] && (
                    <p className="text-xs text-[#E5484D]">{errors[row.statusField]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-[#A0A0A0] text-center">
        You can come back and update these statuses at any time before submitting.
      </p>
    </div>
  );
}
