'use client';

import { useEffect, useRef } from 'react';

interface StepTransitionProps {
  active: boolean;
  animationIndex: number; // which step we're leaving (0-based, mod 5 to cycle)
  onDone: () => void;
}

// =============================================
// ANIMATION 0: "Pulse Acquisition"
// Concentric green rings radiate outward from center
// =============================================
function PulseAcquisition({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 900);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="step-transition-overlay">
      <style>{`
        @keyframes pulseRing {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          70% { opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes pulseDot {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
          50% { opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 2px solid #16dc76;
          box-shadow: 0 0 40px #16dc76, 0 0 80px #16dc7666;
          animation: pulseRing 0.9s ease-out forwards;
        }
        .pulse-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #16dc76;
          box-shadow: 0 0 20px #16dc76, 0 0 40px #16dc7666;
          animation: pulseDot 0.7s ease-out forwards;
        }
      `}</style>
      <div className="pulse-ring" style={{ animationDelay: '0s', width: '200px', height: '200px' }} />
      <div className="pulse-ring" style={{ animationDelay: '0.12s', width: '350px', height: '350px' }} />
      <div className="pulse-ring" style={{ animationDelay: '0.24s', width: '500px', height: '500px' }} />
      <div className="pulse-ring" style={{ animationDelay: '0.36s', width: '700px', height: '700px' }} />
      <div className="pulse-dot" />
    </div>
  );
}

// =============================================
// ANIMATION 1: "Market Scan"
// Horizontal green line sweeps top to bottom
// =============================================
function MarketScan({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 850);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="step-transition-overlay">
      <style>{`
        @keyframes scanLine {
          0% { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes scanFill {
          0% { height: 0%; opacity: 0.7; }
          80% { opacity: 0.5; }
          100% { height: 100%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #16dc76, transparent);
          box-shadow: 0 0 30px #16dc76, 0 0 60px #16dc7644;
          animation: scanLine 0.85s ease-in-out forwards;
        }
        .scan-fill {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #16dc7615, transparent);
          animation: scanFill 0.85s ease-in-out forwards;
        }
      `}</style>
      <div className="scan-fill" />
      <div className="scan-line" />
    </div>
  );
}

// =============================================
// ANIMATION 2: "Grid Lock"
// 8x6 grid of cells fill diagonally
// =============================================
function GridLock({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const cols = 8;
  const rows = 6;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c, delay: (r + c) * 0.04 });
    }
  }

  return (
    <div className="step-transition-overlay">
      <style>{`
        @keyframes gridCell {
          0% { transform: scale(0.3); opacity: 0; }
          40% { transform: scale(1); opacity: 0.25; }
          100% { transform: scale(1); opacity: 0; }
        }
        .grid-cell {
          position: absolute;
          background: #16dc76;
          border-radius: 4px;
          animation: gridCell 0.6s ease-out forwards;
        }
      `}</style>
      {cells.map(({ r, c, delay }) => (
        <div
          key={`${r}-${c}`}
          className="grid-cell"
          style={{
            left: `${(c / cols) * 100}%`,
            top: `${(r / rows) * 100}%`,
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            animationDelay: `${delay}s`,
            padding: '2px',
            backgroundClip: 'content-box',
          }}
        />
      ))}
    </div>
  );
}

// =============================================
// ANIMATION 3: "Shatter Break"
// Green shards explode outward from center
// =============================================
function ShatterBreak({ onDone }: { onDone: () => void }) {
  const shardsRef = useRef<{ angle: number; distance: number; rotation: number; w: number; h: number }[]>([]);

  if (shardsRef.current.length === 0) {
    shardsRef.current = Array.from({ length: 16 }, () => ({
      angle: Math.random() * 360,
      distance: 200 + Math.random() * 300,
      rotation: Math.random() * 720 - 360,
      w: 6 + Math.random() * 18,
      h: 3 + Math.random() * 10,
    }));
  }

  useEffect(() => {
    const timer = setTimeout(onDone, 800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="step-transition-overlay">
      <style>{`
        @keyframes shardExplode {
          0% {
            transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) rotate(var(--rot));
            opacity: 0;
          }
        }
        @keyframes radialFlash {
          0% { opacity: 0; transform: scale(0.3); }
          30% { opacity: 0.6; }
          100% { opacity: 0; transform: scale(2); }
        }
        .shard {
          position: absolute;
          top: 50%;
          left: 50%;
          background: #16dc76;
          box-shadow: 0 0 10px #16dc76;
          border-radius: 1px;
          animation: shardExplode 0.8s ease-out forwards;
        }
        .radial-flash {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, #16dc7633, transparent 70%);
          animation: radialFlash 0.6s ease-out forwards;
        }
      `}</style>
      <div className="radial-flash" />
      {shardsRef.current.map((shard, i) => {
        const rad = (shard.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * shard.distance;
        const ty = Math.sin(rad) * shard.distance;
        return (
          <div
            key={i}
            className="shard"
            style={{
              width: `${shard.w}px`,
              height: `${shard.h}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': `${shard.rotation}deg`,
              animationDelay: `${Math.random() * 0.08}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

// =============================================
// ANIMATION 4: "Launch Beam"
// Vertical green beam fires upward with particles
// =============================================
function LaunchBeam({ onDone }: { onDone: () => void }) {
  const particlesRef = useRef<{ x: number; delay: number; speed: number; size: number }[]>([]);

  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      speed: 0.6 + Math.random() * 0.5,
      size: 2 + Math.random() * 3,
    }));
  }

  useEffect(() => {
    const timer = setTimeout(onDone, 1100);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="step-transition-overlay">
      <style>{`
        @keyframes beamUp {
          0% { height: 0%; bottom: 0; opacity: 0; }
          15% { opacity: 1; }
          50% { height: 110%; opacity: 0.9; }
          100% { height: 110%; opacity: 0; }
        }
        @keyframes beamFlare {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          30% { opacity: 0.7; }
          60% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes particleUp {
          0% { bottom: -5%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 0.6; }
          100% { bottom: 105%; opacity: 0; }
        }
        .launch-beam {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          background: linear-gradient(0deg, #16dc76, transparent);
          box-shadow: 0 0 20px #16dc76, 0 0 40px #16dc7644;
          animation: beamUp 1.1s ease-out forwards;
        }
        .beam-flare {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, #16dc7633, transparent 70%);
          animation: beamFlare 1.0s ease-out 0.15s forwards;
          opacity: 0;
        }
        .beam-particle {
          position: absolute;
          border-radius: 50%;
          background: #16dc76;
          box-shadow: 0 0 6px #16dc76;
          animation: particleUp var(--speed) ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }
      `}</style>
      <div className="launch-beam" />
      <div className="beam-flare" />
      {particlesRef.current.map((p, i) => (
        <div
          key={i}
          className="beam-particle"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--delay': `${p.delay}s`,
            '--speed': `${p.speed}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================
const ANIMATIONS = [PulseAcquisition, MarketScan, GridLock, ShatterBreak, LaunchBeam];

export default function StepTransition({ active, animationIndex, onDone }: StepTransitionProps) {
  if (!active) return null;

  const AnimComponent = ANIMATIONS[animationIndex % ANIMATIONS.length];

  return (
    <>
      <style>{`
        .step-transition-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          pointer-events: none;
          background: #030305;
          overflow: hidden;
        }
      `}</style>
      <AnimComponent onDone={onDone} />
    </>
  );
}
