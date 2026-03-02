'use client';

import { useEffect, useState } from 'react';
import type { TransitionMessage } from '@/lib/onboarding/transition-messages';

interface StepTransitionProps {
  active: boolean;
  message: TransitionMessage | null;
  onDone: () => void;
}

export default function StepTransition({ active, message, onDone }: StepTransitionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active || !message) {
      setVisible(false);
      return;
    }

    // Small delay so the element mounts at opacity 0, then transitions to 1
    const fadeIn = setTimeout(() => setVisible(true), 50);

    // Begin fade out
    const fadeOut = setTimeout(() => setVisible(false), 1700);

    // Signal completion after fade-out finishes
    const done = setTimeout(() => onDone(), 2100);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(done);
    };
  }, [active, message, onDone]);

  if (!active || !message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F4F5F6',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 1.5rem' }}>
        <p
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#25DC7F',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
          }}
        >
          {message.cheerLine}
        </p>
        <p
          style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
            fontWeight: 700,
            color: '#1A1D1F',
            lineHeight: 1.3,
          }}
        >
          {message.nextLine}
        </p>
      </div>
    </div>
  );
}
