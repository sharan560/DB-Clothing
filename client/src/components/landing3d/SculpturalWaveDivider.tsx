import React from 'react';

interface SculpturalWaveDividerProps {
  topColor?: string; // Color of the section above
  bottomColor?: string; // Color of the section below
  inverted?: boolean;
}

export default function SculpturalWaveDivider({
  topColor = '#FAF9F7',
  bottomColor = '#0D0C0B',
  inverted = false,
}: SculpturalWaveDividerProps) {
  return (
    <div
      className="relative w-full overflow-hidden leading-none select-none pointer-events-none"
      style={{ backgroundColor: topColor }}
    >
      <svg
        className={`w-full h-14 sm:h-20 md:h-28 block transition-transform duration-500 ${
          inverted ? 'rotate-180' : ''
        }`}
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C320,80 480,120 720,120 C960,120 1120,40 1440,0 L1440,120 L0,120 Z"
          fill={bottomColor}
        />
        {/* Subtle decorative gold hairline curve */}
        <path
          d="M0,0 C320,80 480,120 720,120 C960,120 1120,40 1440,0"
          stroke="rgba(197, 168, 128, 0.4)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
