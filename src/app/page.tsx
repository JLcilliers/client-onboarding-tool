import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Client Onboarding
          </h1>
          <Link
            href="/admin/onboarding/sessions"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Admin Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Streamlined Client Onboarding
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Create beautiful, multi-step onboarding experiences for your agency clients.
            Collect all the information you need with automatic saving and resume functionality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/onboarding/new"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Create New Onboarding
            </Link>
            <Link
              href="/admin/onboarding/sessions"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
            >
              View All Sessions
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multi-Step Forms
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              12 comprehensive sections covering business overview, goals, brand, technical access, analytics, SEO, PPC, and more.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Auto-Save & Resume
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Progress is automatically saved. Clients can close and return anytime to continue exactly where they left off.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Custom Branding
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload client logos that appear throughout the onboarding experience with a delightful spinning animation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>Built for digital marketing agencies</p>
        </div>
      </footer>
    </div>
  );
}
