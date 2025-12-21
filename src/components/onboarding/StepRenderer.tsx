'use client';

import { OnboardingStep, OnboardingField } from '@/lib/onboarding/steps';

interface StepRendererProps {
  step: OnboardingStep;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (name: string, value: unknown) => void;
}

export default function StepRenderer({ step, values, errors, onChange }: StepRendererProps) {
  const renderField = (field: OnboardingField) => {
    const value = values[field.name];
    const error = errors[field.name];
    const baseInputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      error ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
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
            rows={4}
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
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
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
              className="w-5 h-5 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {step.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {step.description}
        </p>
        {step.estimatedTime && (
          <p className="text-sm text-gray-500 mt-1">
            Estimated time: {step.estimatedTime}
          </p>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {step.fields.map((field) => {
          // For checkboxes, we handle the label differently
          if (field.type === 'checkbox') {
            return (
              <div key={field.name}>
                {renderField(field)}
                {field.helpText && (
                  <p className="mt-1 text-sm text-gray-500 ml-8">{field.helpText}</p>
                )}
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600 ml-8">{errors[field.name]}</p>
                )}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {field.helpText && (
                <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
