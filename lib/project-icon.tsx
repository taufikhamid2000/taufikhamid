import type { ReactNode } from 'react';

/**
 * Per-project decorative icons for ProjectWheel dots — inline SVG, no
 * icon-library dependency (matches the convention in ContactLinks.tsx).
 * Each icon is a minimal 1-3 shape line icon designed to still read at
 * ~14-16px, single-color via stroke="currentColor" so the wheel controls
 * contrast (see ProjectWheel.tsx, which renders these in white against the
 * status-colored dot background).
 */

const props = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const icons: Record<string, ReactNode> = {
  // Graduation cap
  JomBeelajar: (
    <svg {...props}>
      <path d="M2 9l10-5 10 5-10 5-10-5Z" />
      <path d="M6 11.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5" />
    </svg>
  ),
  // Server rack (backend API)
  'JomBeelajar API': (
    <svg {...props}>
      <rect x="4" y="4" width="16" height="6" rx="1" />
      <rect x="4" y="14" width="16" height="6" rx="1" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  ),
  // Mobile phone
  'JomBeelajar Android': (
    <svg {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
  // Clipboard/checklist (survey)
  Veyoyee: (
    <svg {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3h6v3H9z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  // House/door (room rental)
  BilikSewa: (
    <svg {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  ),
  // Numbered queue ticket
  JomBeratur: (
    <svg {...props}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-6V6Z" />
      <path d="M13 9v6" />
    </svg>
  ),
  // Briefcase
  JobMatch: (
    <svg {...props}>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
  // Storefront/shop
  UYE: (
    <svg {...props}>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M4 9v10h16V9" />
      <path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  ),
  // Shopping cart (reseller marketplace)
  Proxlox: (
    <svg {...props}>
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 4h2l2.4 12.2a2 2 0 0 0 2 1.8h8.2a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  ),
  // Fork & knife (restaurant manager)
  SBMP: (
    <svg {...props}>
      <path d="M6 3v7a2 2 0 0 0 4 0V3" />
      <path d="M8 10v11" />
      <path d="M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4v10" />
    </svg>
  ),
  // Game controller
  ACCodeSEA: (
    <svg {...props}>
      <rect x="2" y="8" width="20" height="10" rx="5" />
      <path d="M7 11v4M5 13h4" />
      <path d="M16 12h.01M18.5 14.5h.01" />
    </svg>
  ),
  // Layout/grid template
  Template: (
    <svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 9v12" />
    </svg>
  ),
  // Chat bubble (knowledge sharing)
  TIWIKOM: (
    <svg {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  ),
  // Abstract ball (circle + line + center dot) — avoids trademarked design
  'Pokemon App': (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  // Map pin (geo API demo)
  'WXGeoDemo API': (
    <svg {...props}>
      <path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  ),
  // Certificate/ribbon
  Mysertifico: (
    <svg {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M9 12.5 7.5 21 12 18.5 16.5 21 15 12.5" />
    </svg>
  ),
  // Question mark in circle
  'Quiz App': (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  ),
  // Coin (finance)
  JomDuit: (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5c0-1.4 1.1-2.2 2.5-2.2s2.5.7 2.5 1.8c0 2.4-5 1.4-5 3.8 0 1.1 1.1 1.8 2.5 1.8s2.5-.8 2.5-2.2" />
    </svg>
  ),
  // Bus/shuttle
  JomTumpang: (
    <svg {...props}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M3 12h18" />
      <circle cx="7.5" cy="19" r="1.3" />
      <circle cx="16.5" cy="19" r="1.3" />
    </svg>
  ),
};

/** Returns the inline SVG icon for a project name, or null if none is defined. */
export function projectIcon(name: string): ReactNode | null {
  return icons[name] ?? null;
}
