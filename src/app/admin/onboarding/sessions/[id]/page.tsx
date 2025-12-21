'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { onboardingSteps } from '@/lib/onboarding/steps';

interface SessionDetail {
  id: string;
  token: string;
  status: 'draft' | 'in_progress' | 'submitted';
  current_step: number;
  last_saved_at: string | null;
  submitted_at: string | null;
  created_at: string;
  logo_url: string | null;
  clients: {
    client_name: string;
    primary_contact_name: string | null;
    primary_contact_email: string | null;
  };
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
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessionDetail() {
      try {
        const supabase = createClient();

        // Fetch session
        const { data: sessionData, error: sessionError } = await supabase
          .from('onboarding_sessions')
          .select(`
            id,
            token,
            status,
            current_step,
            last_saved_at,
            submitted_at,
            created_at,
            logo_url,
            clients (
              client_name,
              primary_contact_name,
              primary_contact_email
            )
          `)
          .eq('id', id)
          .single();

        if (sessionError) {
          throw sessionError;
        }

        setSession(sessionData);

        // Fetch answers
        const { data: answersData, error: answersError } = await supabase
          .from('onboarding_answers')
          .select('*')
          .eq('session_id', id)
          .order('updated_at', { ascending: true });

        if (answersError) {
          throw answersError;
        }

        setAnswers(answersData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionDetail();
  }, [id]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">Draft</span>;
      case 'in_progress':
        return <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">In Progress</span>;
      case 'submitted':
        return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">Submitted</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/onboarding/sessions"
              className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sessions
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {session.clients?.client_name || 'Session Details'}
            </h1>
          </div>
          {getStatusBadge(session.status)}
        </div>

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

        {/* Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${(session.current_step / onboardingSteps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {session.current_step} / {onboardingSteps.length} steps
            </span>
          </div>
        </div>

        {/* Answers by Step */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Responses by Section</h2>

          {answers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No responses have been submitted yet.
            </p>
          ) : (
            <div className="space-y-4">
              {onboardingSteps.map((step) => {
                const answer = answers.find(a => a.step_key === step.key);
                const isExpanded = expandedStep === step.key;

                return (
                  <div
                    key={step.key}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.key)}
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
                          <span className="w-6 h-6 bg-gray-200 dark:bg-gray-600 text-gray-400 rounded-full flex items-center justify-center text-xs">
                            {onboardingSteps.indexOf(step) + 1}
                          </span>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {step.title}
                        </span>
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

                    {isExpanded && answer && (
                      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid gap-4">
                          {Object.entries(answer.answers).map(([key, value]) => {
                            const field = step.fields.find(f => f.name === key);
                            return (
                              <div key={key} className="flex flex-col sm:flex-row sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-1/3">
                                  {field?.label || key}
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white sm:w-2/3">
                                  {formatValue(value)}
                                </dd>
                              </div>
                            );
                          })}
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                          Last updated: {formatDate(answer.updated_at)}
                        </p>
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
