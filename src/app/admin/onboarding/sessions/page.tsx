'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

interface Session {
  id: string;
  token: string;
  status: 'draft' | 'in_progress' | 'submitted';
  currentStep: number;
  lastSavedAt: string | null;
  submittedAt: string | null;
  createdAt: string;
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  clientName: string;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
}

type StatusFilter = 'all' | 'draft' | 'in_progress' | 'submitted';
type ProgressFilter = 'all' | '0-25' | '26-50' | '51-75' | '76-99' | '100';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/admin/onboarding/sessions');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch sessions');
        }

        setSessions(data.sessions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, []);

  // Filter sessions based on selected filters
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Status filter
      if (statusFilter !== 'all' && session.status !== statusFilter) {
        return false;
      }

      // Progress filter
      if (progressFilter !== 'all') {
        const percent = session.progressPercent;
        switch (progressFilter) {
          case '0-25':
            if (percent > 25) return false;
            break;
          case '26-50':
            if (percent < 26 || percent > 50) return false;
            break;
          case '51-75':
            if (percent < 51 || percent > 75) return false;
            break;
          case '76-99':
            if (percent < 76 || percent > 99) return false;
            break;
          case '100':
            if (percent !== 100) return false;
            break;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = session.clientName.toLowerCase().includes(query);
        const matchesEmail = session.primaryContactEmail?.toLowerCase().includes(query);
        const matchesContact = session.primaryContactName?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesContact) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, statusFilter, progressFilter, searchQuery]);

  // Stats for the dashboard header
  const stats = useMemo(() => {
    const total = sessions.length;
    const draft = sessions.filter(s => s.status === 'draft').length;
    const inProgress = sessions.filter(s => s.status === 'in_progress').length;
    const submitted = sessions.filter(s => s.status === 'submitted').length;
    const avgProgress = total > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.progressPercent, 0) / total)
      : 0;
    return { total, draft, inProgress, submitted, avgProgress };
  }, [sessions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">Draft</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">In Progress</span>;
      case 'submitted':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Submitted</span>;
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

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Onboarding Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage all client onboarding sessions
            </p>
          </div>
          <Link
            href="/admin/onboarding/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Draft</p>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-300 mt-1">{stats.draft}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.submitted}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Progress</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.avgProgress}%</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by client name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>

            {/* Progress Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress:</label>
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value as ProgressFilter)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="0-25">0-25%</option>
                <option value="26-50">26-50%</option>
                <option value="51-75">51-75%</option>
                <option value="76-99">76-99%</option>
                <option value="100">100%</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(statusFilter !== 'all' || progressFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setProgressFilter('all');
                  setSearchQuery('');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              {sessions.length === 0 ? (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No sessions yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first onboarding session to get started.
                  </p>
                  <Link
                    href="/admin/onboarding/new"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create First Session
                  </Link>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No matching sessions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or search query.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {session.clientName}
                          </div>
                          {session.primaryContactEmail && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {session.primaryContactEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(session.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px]">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {session.completedSteps}/{session.totalSteps}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {session.progressPercent}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getProgressColor(session.progressPercent)}`}
                                style={{ width: `${session.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatRelativeTime(session.lastSavedAt || session.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {session.submittedAt ? `Submitted ${formatDate(session.submittedAt)}` : `Created ${formatDate(session.createdAt)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/onboarding/sessions/${session.id}`}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            View Responses
                          </Link>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/onboarding/${session.token}`);
                            }}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Copy client link"
                          >
                            Copy Link
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredSessions.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </div>
        )}
      </div>
    </div>
  );
}
