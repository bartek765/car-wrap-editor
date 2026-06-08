import React from 'react';

// Professional SVG icon set — clean, minimal, monochrome
export function IconCar({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l1.5-4h11L17 10" />
      <rect x="2" y="10" width="16" height="5" rx="1.5" />
      <circle cx="5.5" cy="15.5" r="1.5" />
      <circle cx="14.5" cy="15.5" r="1.5" />
      <path d="M2 12h16" />
    </svg>
  );
}

export function IconPaint({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18c0-1.1.9-2 2-2h.5l7-7-2.5-2.5-7 7V18H2z" />
      <path d="M13.5 5.5l1-1a2.12 2.12 0 013 3l-1 1" />
      <path d="M17 11c0 2-1.5 3.5-1.5 3.5S14 13 14 11a1.5 1.5 0 013 0z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconLayers({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14l8 4 8-4" />
      <path d="M2 10l8 4 8-4" />
      <path d="M2 6l8-4 8 4-8 4-8-4z" />
    </svg>
  );
}

export function IconSticker({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 10A7.5 7.5 0 102.5 10" />
      <path d="M10 17.5a7.47 7.47 0 006-3l-6-6-3 3a7.47 7.47 0 003 6z" />
    </svg>
  );
}

export function IconUpload({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
      <path d="M10 3v10M6.5 6.5L10 3l3.5 3.5" />
    </svg>
  );
}

export function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h14M8 6V4h4v2M5 6l1 11h8l1-11" />
    </svg>
  );
}

export function IconChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export function IconChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 5l5 5-5 5" />
    </svg>
  );
}

export function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4 4 8-8" />
    </svg>
  );
}

export function IconSliders({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M3 5h14M3 10h14M3 15h14" />
      <circle cx="7" cy="5" r="2" fill="#0f1013" />
      <circle cx="13" cy="10" r="2" fill="#0f1013" />
      <circle cx="8" cy="15" r="2" fill="#0f1013" />
    </svg>
  );
}

export function IconImage({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="14" rx="2" />
      <circle cx="7" cy="8" r="1.5" />
      <path d="M2 14l4-4 3 3 3-3 6 5" />
    </svg>
  );
}

export function IconClose({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}
