'use client';

import { useState } from 'react';
import Link from 'next/link';

const CLIXSY_LOGO_URL = 'https://res.cloudinary.com/dovgh19xr/image/upload/v1766427227/new_logo_nvrux0.svg';

export default function NewOnboardingPage() {
  const [clientName, setClientName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call admin API to create session
      const response = await fetch('/api/admin/onboarding/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          contactName,
          contactEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session');
      }

      // Generate the onboarding URL
      const baseUrl = window.location.origin;
      setGeneratedUrl(`${baseUrl}/onboarding/${data.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
    }
  };

  if (generatedUrl) {
    return (
      <div className="min-h-screen bg-[#F4F5F6]">
        {/* Header */}
        <header className="bg-[#0F1A14]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <img src={CLIXSY_LOGO_URL} alt="Clixsy" className="h-8" />
            </Link>
            <div className="px-4 py-2 bg-[#1A2A1F] text-white text-sm font-semibold rounded-lg">
              Clixsy Onboarding Portal
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-2xl w-full mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-[#E6E8EA] p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#25DC7F]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#25DC7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-center text-[#0B0B0B] mb-4">
                Onboarding Link Created!
              </h1>
              <p className="text-center text-[#6B6B6B] mb-6">
                Share this link with your client to begin their onboarding:
              </p>

              <div className="bg-[#F4F5F6] rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="flex-1 bg-transparent text-[#0B0B0B] text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-[#25DC7F] text-white rounded-lg text-sm font-semibold hover:bg-[#1DB96A] transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setGeneratedUrl(null);
                    setClientName('');
                    setContactName('');
                    setContactEmail('');
                  }}
                  className="flex-1 px-6 py-3 border border-[#E6E8EA] text-[#0B0B0B] rounded-lg font-semibold hover:bg-[#F4F5F6] transition-colors"
                >
                  Create Another
                </button>
                <Link
                  href="/admin/onboarding/sessions"
                  className="flex-1 px-6 py-3 bg-[#0F1A14] text-white rounded-lg font-semibold text-center hover:bg-[#1A2A1F] transition-colors"
                >
                  View All Sessions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6]">
      {/* Header */}
      <header className="bg-[#0F1A14]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src={CLIXSY_LOGO_URL} alt="Clixsy" className="h-8" />
          </Link>
          <div className="px-4 py-2 bg-[#1A2A1F] text-white text-sm font-semibold rounded-lg">
            Clixsy Onboarding Portal
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-[#E6E8EA] p-8">
            <h1 className="text-2xl font-extrabold text-[#0B0B0B] mb-2">
              Create New Onboarding Session
            </h1>
            <p className="text-[#6B6B6B] mb-8">
              Set up a new client onboarding by providing their details below.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-[#E5484D]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Name */}
              <div>
                <label htmlFor="clientName" className="block text-sm font-semibold text-[#0B0B0B] mb-2">
                  Client Name <span className="text-[#E5484D]">*</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  placeholder="Acme Corporation"
                  className="w-full px-4 py-3 border border-[#E6E8EA] rounded-lg focus:ring-2 focus:ring-[#25DC7F]/20 focus:border-[#25DC7F] transition-all"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-semibold text-[#0B0B0B] mb-2">
                  Primary Contact Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 border border-[#E6E8EA] rounded-lg focus:ring-2 focus:ring-[#25DC7F]/20 focus:border-[#25DC7F] transition-all"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-[#0B0B0B] mb-2">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="john@acme.com"
                  className="w-full px-4 py-3 border border-[#E6E8EA] rounded-lg focus:ring-2 focus:ring-[#25DC7F]/20 focus:border-[#25DC7F] transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !clientName}
                className="w-full px-6 py-3 bg-[#25DC7F] text-white rounded-lg font-semibold hover:bg-[#1DB96A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Onboarding Link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
