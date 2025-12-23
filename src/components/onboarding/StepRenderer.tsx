'use client';

import { OnboardingStep, OnboardingField } from '@/lib/onboarding/steps';

interface StepRendererProps {
  step: OnboardingStep;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (name: string, value: unknown) => void;
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  // Handle youtu.be format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  // Handle youtube.com/watch?v= format
  const longMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (longMatch) {
    return `https://www.youtube.com/embed/${longMatch[1]}`;
  }
  // Handle youtube.com/embed/ format (already embedded)
  if (url.includes('youtube.com/embed/')) {
    return url.split('?')[0]; // Remove any query params
  }
  return null;
}

// Video Tutorial Component
function VideoTutorial({ url, title }: { url: string; title: string }) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#25DC7F] hover:text-[#1eb86a] font-medium"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
        {title}
      </a>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-[#E5484D]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
        <span className="text-sm font-semibold text-[#0B0B0B]">{title}</span>
      </div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#E6E8EA] bg-black">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

// Determine if a field should span both columns (full width)
function shouldSpanFullWidth(field: OnboardingField): boolean {
  // Fields with video tutorials always span full width
  if (field.videoUrl) return true;
  // Textarea always spans full width
  if (field.type === 'textarea') return true;
  // Multiselect and radio with options span full width (they have vertical options)
  if (field.type === 'multiselect' || field.type === 'radio') return true;
  // Fields with many options or long labels
  if (field.options && field.options.length > 4) return true;
  return false;
}

export default function StepRenderer({ step, values, errors, onChange }: StepRendererProps) {
  const renderField = (field: OnboardingField) => {
    const value = values[field.name];
    const error = errors[field.name];
    const baseInputClasses = `w-full px-3 py-2.5 border rounded-lg transition-all duration-150 text-sm ${
      error
        ? 'border-[#E5484D] bg-red-50'
        : 'border-[#E6E8EA] bg-white hover:border-[#A0A0A0] focus:border-[#25DC7F] focus:ring-2 focus:ring-[#25DC7F]/20'
    }`;

    // Check if field should be shown based on dependsOn
    if (field.dependsOn) {
      const dependentValue = values[field.dependsOn.field];
      if (dependentValue !== field.dependsOn.value) {
        return null;
      }
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all duration-150 text-sm ${
                  selectedValues.includes(option.value)
                    ? 'border-[#25DC7F] bg-[#25DC7F]/5'
                    : 'border-[#E6E8EA] hover:border-[#A0A0A0]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange(field.name, [...selectedValues, option.value]);
                    } else {
                      onChange(field.name, selectedValues.filter((v) => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 text-[#25DC7F] rounded border-[#E6E8EA] focus:ring-[#25DC7F] focus:ring-offset-0"
                />
                <span className="text-[#1A1A1A]">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={(value as boolean) || false}
              onChange={(e) => onChange(field.name, e.target.checked)}
              className="w-5 h-5 mt-0.5 text-[#25DC7F] rounded border-[#E6E8EA] focus:ring-[#25DC7F] focus:ring-offset-0"
            />
            <span className="text-[#1A1A1A]">{field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all duration-150 text-sm ${
                  value === option.value
                    ? 'border-[#25DC7F] bg-[#25DC7F]/5'
                    : 'border-[#E6E8EA] hover:border-[#A0A0A0]'
                }`}
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-4 h-4 text-[#25DC7F] border-[#E6E8EA] focus:ring-[#25DC7F] focus:ring-offset-0"
                />
                <span className="text-[#1A1A1A]">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Filter out hidden fields (based on dependsOn conditions)
  const visibleFields = step.fields.filter((field) => {
    if (field.dependsOn) {
      const dependentValue = values[field.dependsOn.field];
      return dependentValue === field.dependsOn.value;
    }
    return true;
  });

  return (
    <div>
      {/* Two-column grid layout for fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-4">
        {visibleFields.map((field) => {
          const spanFull = shouldSpanFullWidth(field);

          // For checkboxes, we handle the label differently
          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={spanFull ? 'md:col-span-2' : ''}>
                {/* Video Tutorial - shown above the field */}
                {field.videoUrl && field.videoTitle && (
                  <VideoTutorial url={field.videoUrl} title={field.videoTitle} />
                )}
                {renderField(field)}
                {field.helpText && (
                  <p className="mt-1 text-xs text-[#6B6B6B] ml-8">{field.helpText}</p>
                )}
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-[#E5484D] ml-8">{errors[field.name]}</p>
                )}
              </div>
            );
          }

          return (
            <div key={field.name} className={spanFull ? 'md:col-span-2' : ''}>
              {/* Video Tutorial - shown above the field */}
              {field.videoUrl && field.videoTitle && (
                <VideoTutorial url={field.videoUrl} title={field.videoTitle} />
              )}
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-[#0B0B0B] mb-1.5"
              >
                {field.label}
                {field.required && <span className="text-[#E5484D] ml-1">*</span>}
              </label>
              {renderField(field)}
              {field.helpText && (
                <p className="mt-1 text-xs text-[#6B6B6B]">{field.helpText}</p>
              )}
              {errors[field.name] && (
                <p className="mt-1 text-xs text-[#E5484D]">{errors[field.name]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
