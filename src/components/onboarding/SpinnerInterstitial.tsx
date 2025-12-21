'use client';

import { useEffect, useState } from 'react';

interface SpinnerInterstitialProps {
  logoUrl?: string | null;
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function SpinnerInterstitial({
  logoUrl,
  message = 'Saving your progress...',
  duration = 1200,
  onComplete,
}: SpinnerInterstitialProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with spin animation */}
        <div className="relative">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="w-24 h-24 object-contain animate-spin-slow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          )}
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium animate-pulse">
          {message}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
