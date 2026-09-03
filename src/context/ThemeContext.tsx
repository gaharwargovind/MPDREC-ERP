import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeMode, ColorPaletteId, ColorPaletteConfig, COLOR_PALETTES } from '../types/theme';
import { storageService } from '../services/storageService';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colorPalette: ColorPaletteId;
  activePaletteConfig: ColorPaletteConfig;
  availablePalettes: ColorPaletteConfig[];
  isThemeModalOpen: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setColorPalette: (palette: ColorPaletteId) => void;
  toggleDarkMode: () => void;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => storageService.getThemeMode());
  const [colorPalette, setColorPaletteState] = useState<ColorPaletteId>(() => storageService.getColorPalette());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to OS color scheme preferences
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Compute effective dark mode
  const isDark = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemIsDark;
  }, [themeMode, systemIsDark]);

  // Apply classes to document root and meta theme-color
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // 1. Dark mode class & attributes
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-mode', 'dark');
      document.body.classList.add('dark');
      document.body.setAttribute('data-mode', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-mode', 'light');
      document.body.classList.remove('dark');
      document.body.setAttribute('data-mode', 'light');
    }

    // 2. Palette classes & data-theme
    root.setAttribute('data-theme', colorPalette);
    document.body.setAttribute('data-theme', colorPalette);

    const allThemeClasses = [
      'theme-imperial-navy',
      'theme-royal-emerald',
      'theme-crimson-heritage',
      'theme-cobalt-tech',
      'theme-obsidian-bronze',
      'theme-navy',
      'theme-emerald',
      'theme-crimson',
      'theme-cobalt',
      'theme-obsidian'
    ];

    allThemeClasses.forEach(cls => {
      root.classList.remove(cls);
      document.body.classList.remove(cls);
    });

    root.classList.add(`theme-${colorPalette}`);
    document.body.classList.add(`theme-${colorPalette}`);

    // Update meta theme-color for mobile address bars
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    const currentConfig = COLOR_PALETTES.find(p => p.id === colorPalette) || COLOR_PALETTES[0];
    metaTheme.setAttribute('content', isDark ? currentConfig.swatches.surfaceDark : currentConfig.swatches.primary);
  }, [isDark, colorPalette]);

  // Sync external theme changes
  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const custom = e as CustomEvent<{ mode: ThemeMode }>;
      if (custom.detail?.mode) {
        setThemeModeState(custom.detail.mode);
      }
    };

    const handlePaletteChange = (e: Event) => {
      const custom = e as CustomEvent<{ palette: ColorPaletteId }>;
      if (custom.detail?.palette) {
        setColorPaletteState(custom.detail.palette);
      }
    };

    window.addEventListener('mpdrec_theme_mode_changed', handleModeChange);
    window.addEventListener('mpdrec_color_palette_changed', handlePaletteChange);

    return () => {
      window.removeEventListener('mpdrec_theme_mode_changed', handleModeChange);
      window.removeEventListener('mpdrec_color_palette_changed', handlePaletteChange);
    };
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storageService.setThemeMode(mode);
  };

  const setColorPalette = (palette: ColorPaletteId) => {
    setColorPaletteState(palette);
    storageService.setColorPalette(palette);
  };

  const toggleDarkMode = () => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
  };

  const activePaletteConfig = useMemo(() => {
    return COLOR_PALETTES.find(p => p.id === colorPalette) || COLOR_PALETTES[0];
  }, [colorPalette]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        colorPalette,
        activePaletteConfig,
        availablePalettes: COLOR_PALETTES,
        isThemeModalOpen,
        setThemeMode,
        setColorPalette,
        toggleDarkMode,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
