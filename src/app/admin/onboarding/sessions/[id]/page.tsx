'use client';

import { useEffect, useState, use, useMemo, useRef } from 'react';
import Link from 'next/link';
import { onboardingSteps } from '@/lib/onboarding/steps';

interface ClientInfo {
  client_name: string;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
}

interface SessionDetail {
  id: string;
  token: string;
  status: 'draft' | 'in_progress' | 'submitted';
  current_step: number;
  last_saved_at: string | null;
  submitted_at: string | null;
  created_at: string;
  logo_url: string | null;
  clients: ClientInfo | null;
}

interface Answer {
  step_key: string;
  answers: Record<string, unknown>;
  completed: boolean;
  updated_at: string;
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function fetchSessionDetail() {
      try {
        const response = await fetch(`/api/admin/onboarding/sessions/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch session details');
        }

        setSession(data.session);
        setAnswers(data.answers || []);

        // Auto-expand all sections that have answers
        const completedSteps = new Set<string>();
        (data.answers || []).forEach((a: Answer) => {
          if (a.completed) completedSteps.add(a.step_key);
        });
        setExpandedSteps(completedSteps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionDetail();
  }, [id]);

  // Calculate progress stats
  const progressStats = useMemo(() => {
    const completedSteps = answers.filter(a => a.completed).length;
    const totalSteps = onboardingSteps.length;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);
    return { completedSteps, totalSteps, progressPercent };
  }, [answers]);

  const getStepTitle = (stepKey: string) => {
    const step = onboardingSteps.find(s => s.key === stepKey);
    return step?.title || stepKey;
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ') || '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value) || '-';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string, size: 'sm' | 'lg' = 'sm') => {
    const sizeClasses = size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs';
    switch (status) {
      case 'draft':
        return <span className={`${sizeClasses} font-semibold bg-gray-100 text-gray-700 rounded-full`}>Draft</span>;
      case 'in_progress':
        return <span className={`${sizeClasses} font-semibold bg-yellow-100 text-yellow-700 rounded-full`}>In Progress</span>;
      case 'submitted':
        return <span className={`${sizeClasses} font-semibold bg-green-100 text-green-700 rounded-full`}>Submitted</span>;
      default:
        return null;
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-green-500';
    if (percent >= 75) return 'bg-blue-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const scrollToSection = (stepKey: string) => {
    const ref = sectionRefs.current[stepKey];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Expand the section if not already expanded
      setExpandedSteps(prev => new Set([...prev, stepKey]));
    }
  };

  const toggleStep = (stepKey: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepKey)) {
        newSet.delete(stepKey);
      } else {
        newSet.add(stepKey);
      }
      return newSet;
    });
  };

  // Generate text summary for copy
  const generateTextSummary = () => {
    if (!session) return '';

    let summary = `ONBOARDING SUMMARY\n`;
    summary += `${'='.repeat(50)}\n\n`;
    summary += `Client: ${session.clients?.client_name || 'Unknown'}\n`;
    summary += `Contact: ${session.clients?.primary_contact_name || '-'} (${session.clients?.primary_contact_email || '-'})\n`;
    summary += `Status: ${session.status.replace('_', ' ').toUpperCase()}\n`;
    summary += `Progress: ${progressStats.completedSteps}/${progressStats.totalSteps} steps (${progressStats.progressPercent}%)\n`;
    summary += `Created: ${formatDate(session.created_at)}\n`;
    if (session.submitted_at) {
      summary += `Submitted: ${formatDate(session.submitted_at)}\n`;
    }
    summary += `\n${'='.repeat(50)}\n\n`;
    summary += `RESPONSES\n\n`;

    onboardingSteps.forEach((step, index) => {
      const answer = answers.find(a => a.step_key === step.key);
      summary += `${index + 1}. ${step.title}\n`;
      summary += `${'-'.repeat(40)}\n`;

      if (answer && answer.completed) {
        Object.entries(answer.answers).forEach(([key, value]) => {
          const field = step.fields.find(f => f.name === key);
          const label = field?.label || key;
          summary += `  ${label}: ${formatValue(value)}\n`;
        });
      } else {
        summary += `  (Not completed)\n`;
      }
      summary += '\n';
    });

    return summary;
  };

  // Generate JSON export
  const generateJSONExport = () => {
    if (!session) return '';

    const exportData = {
      session: {
        id: session.id,
        status: session.status,
        client_name: session.clients?.client_name,
        contact_name: session.clients?.primary_contact_name,
        contact_email: session.clients?.primary_contact_email,
        created_at: session.created_at,
        submitted_at: session.submitted_at,
        progress: {
          completed_steps: progressStats.completedSteps,
          total_steps: progressStats.totalSteps,
          percent: progressStats.progressPercent,
        },
      },
      answers: answers.reduce((acc, answer) => {
        acc[answer.step_key] = {
          completed: answer.completed,
          updated_at: answer.updated_at,
          data: answer.answers,
        };
        return acc;
      }, {} as Record<string, unknown>),
    };

    return JSON.stringify(exportData, null, 2);
  };

  const handleCopySummary = async () => {
    const summary = generateTextSummary();
    await navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportJSON = () => {
    const json = generateJSONExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-${session?.clients?.client_name?.replace(/\s+/g, '-').toLowerCase() || session?.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Session Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The requested session could not be found.'}
            </p>
            <Link
              href="/admin/onboarding/sessions"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Sessions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/onboarding/sessions"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to Sessions"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {session.clients?.client_name || 'Session Details'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {getStatusBadge(session.status)}
                  {session.submitted_at && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted {formatDate(session.submitted_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Summary & Export */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(progressStats.progressPercent)}`}
                      style={{ width: `${progressStats.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {progressStats.completedSteps}/{progressStats.totalSteps}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {progressStats.progressPercent}% complete
                </span>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Copy text summary to clipboard"
                >
                  {copiedSummary ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Summary
                    </>
                  )}
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Download as JSON file"
                >
                  {copiedJSON ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export JSON
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Session Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contact Name</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {session.clients?.primary_contact_name || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {session.clients?.primary_contact_email || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(session.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Saved</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(session.last_saved_at)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Onboarding Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                {typeof window !== 'undefined' ? `${window.location.origin}/onboarding/${session.token}` : `/onboarding/${session.token}`}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/onboarding/${session.token}`);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Jump to Section Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Jump to Section</h2>
          <div className="flex flex-wrap gap-2">
            {onboardingSteps.map((step, index) => {
              const answer = answers.find(a => a.step_key === step.key);
              const isCompleted = answer?.completed;

              return (
                <button
                  key={step.key}
                  onClick={() => scrollToSection(step.key)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
                    isCompleted
                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isCompleted && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {index + 1}. {step.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Answers by Step */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Responses by Section</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedSteps(new Set(onboardingSteps.map(s => s.key)))}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Expand All
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={() => setExpandedSteps(new Set())}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Collapse All
              </button>
            </div>
          </div>

          {answers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No responses have been submitted yet.
            </p>
          ) : (
            <div className="space-y-4">
              {onboardingSteps.map((step, index) => {
                const answer = answers.find(a => a.step_key === step.key);
                const isExpanded = expandedSteps.has(step.key);

                return (
                  <div
                    key={step.key}
                    ref={el => { sectionRefs.current[step.key] = el; }}
                    id={`section-${step.key}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden scroll-mt-24"
                  >
                    <button
                      onClick={() => toggleStep(step.key)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {answer?.completed ? (
                          <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-6 h-6 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {step.title}
                        </span>
                        {answer?.completed && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Updated {formatDate(answer.updated_at)}
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                        {answer ? (
                          <div className="grid gap-4">
                            {Object.entries(answer.answers).map(([key, value]) => {
                              const field = step.fields.find(f => f.name === key);
                              return (
                                <div key={key} className="flex flex-col sm:flex-row sm:gap-4">
                                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-1/3">
                                    {field?.label || key}
                                  </dt>
                                  <dd className="text-sm text-gray-900 dark:text-white sm:w-2/3 whitespace-pre-wrap">
                                    {formatValue(value)}
                                  </dd>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            This section has not been completed yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
