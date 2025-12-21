import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-12">
          Client Onboarding
        </h1>

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
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
