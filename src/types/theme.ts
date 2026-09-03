export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorPaletteId = 
  | 'imperial-navy'
  | 'royal-emerald'
  | 'crimson-heritage'
  | 'cobalt-tech'
  | 'obsidian-bronze';

export interface ColorPaletteConfig {
  id: ColorPaletteId;
  name: string;
  subtitle: string;
  description: string;
  tag: string;
  primaryColor: string;
  accentColor: string;
  previewClass: string;
  swatches: {
    primary: string;
    secondary: string;
    accent: string;
    surfaceLight: string;
    surfaceDark: string;
  };
}

export const COLOR_PALETTES: ColorPaletteConfig[] = [
  {
    id: 'imperial-navy',
    name: 'Imperial Navy & Gold',
    subtitle: 'Heritage Academic & Premier University',
    description: 'Deep royal navy paired with warm academic gold ochre. The quintessential prestige university design standard.',
    tag: 'Classic Prestige',
    primaryColor: '#1e3a8a',
    accentColor: '#d97706',
    previewClass: 'from-blue-900 via-indigo-900 to-amber-700',
    swatches: {
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#d97706',
      surfaceLight: '#f8fafc',
      surfaceDark: '#0b0f19',
    },
  },
  {
    id: 'royal-emerald',
    name: 'Royal Emerald & Sage',
    subtitle: 'Eco-Campus & Sustainable Engineering',
    description: 'Rich botanical pine and emerald greens accented with warm ochre. Grounded, serene, and academically dignified.',
    tag: 'Green Campus',
    primaryColor: '#064e3b',
    accentColor: '#059669',
    previewClass: 'from-emerald-900 via-teal-900 to-amber-600',
    swatches: {
      primary: '#064e3b',
      secondary: '#047857',
      accent: '#d97706',
      surfaceLight: '#f7faf8',
      surfaceDark: '#06140e',
    },
  },
  {
    id: 'crimson-heritage',
    name: 'Collegiate Crimson & Sand',
    subtitle: 'Ivy League & Oxford Distinction',
    description: 'Deep burgundy crimson with warm antique gold and sandstone accents. Historic, authoritative, and distinguished.',
    tag: 'Ivy Heritage',
    primaryColor: '#881337',
    accentColor: '#ca8a04',
    previewClass: 'from-rose-950 via-red-900 to-amber-600',
    swatches: {
      primary: '#881337',
      secondary: '#991b1b',
      accent: '#d97706',
      surfaceLight: '#fafaf9',
      surfaceDark: '#140a0d',
    },
  },
  {
    id: 'cobalt-tech',
    name: 'Cobalt Tech & Cyber Teal',
    subtitle: 'Modern Engineering & Computational Sciences',
    description: 'Precision cobalt blue accented with sharp electric teal and slate. Crisp, high-tech polytechnic precision.',
    tag: 'Polytechnic',
    primaryColor: '#1d4ed8',
    accentColor: '#0d9488',
    previewClass: 'from-blue-800 via-sky-800 to-teal-600',
    swatches: {
      primary: '#1d4ed8',
      secondary: '#2563EB',
      accent: '#0d9488',
      surfaceLight: '#f8fafc',
      surfaceDark: '#070d18',
    },
  },
  {
    id: 'obsidian-bronze',
    name: 'Obsidian Graphite & Bronze',
    subtitle: 'Minimalist Executive & High Contrast',
    description: 'Pure architectural graphite with champagne bronze highlights. Minimalist, distraction-free executive clarity.',
    tag: 'Executive Minimal',
    primaryColor: '#18181b',
    accentColor: '#b45309',
    previewClass: 'from-zinc-900 via-stone-900 to-amber-700',
    swatches: {
      primary: '#18181b',
      secondary: '#27272a',
      accent: '#d97706',
      surfaceLight: '#fafafa',
      surfaceDark: '#09090b',
    },
  },
];
