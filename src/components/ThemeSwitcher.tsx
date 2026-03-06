import { useState, useEffect, useRef } from 'react';
import { THEMES, type ThemeName } from '../types/slides';

const THEME_STORAGE_KEY = 'slideshow-theme';

interface ThemeSwitcherProps {
  onThemeChange?: (theme: ThemeName) => void;
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('festive');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load theme from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    if (stored && THEMES.some(t => t.id === stored)) {
      setCurrentTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    onThemeChange?.(theme);
    setIsOpen(false);
  };

  const currentThemeData = THEMES.find(t => t.id === currentTheme);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-control"
        aria-label="Change theme"
        title="Change theme"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 glass rounded-lg overflow-hidden shadow-lg animate-scale-in origin-top-right">
          <div className="p-3 border-b border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text)]">Theme</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Current: {currentThemeData?.name}
            </p>
          </div>

          <div className="p-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`w-full px-3 py-2 rounded-md text-left transition-colors flex items-center gap-3 ${
                  currentTheme === theme.id
                    ? 'bg-[var(--color-primary)]/20 text-[var(--color-text)]'
                    : 'hover:bg-[var(--button-hover-bg)] text-[var(--color-text-muted)]'
                }`}
              >
                {/* Theme color preview */}
                <div className="flex gap-1">
                  {theme.id === 'festive' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-pink-500" />
                      <div className="w-3 h-3 rounded-full bg-teal-500" />
                    </>
                  )}
                  {theme.id === 'minimal-light' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300" />
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <div className="w-3 h-3 rounded-full bg-gray-800" />
                    </>
                  )}
                  {theme.id === 'minimal-dark' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-gray-900" />
                      <div className="w-3 h-3 rounded-full bg-gray-600" />
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                    </>
                  )}
                  {theme.id === 'warm-documentary' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-amber-700" />
                      <div className="w-3 h-3 rounded-full bg-orange-800" />
                      <div className="w-3 h-3 rounded-full bg-stone-500" />
                    </>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{theme.name}</p>
                  <p className="text-xs opacity-70">{theme.description}</p>
                </div>

                {/* Check mark for current */}
                {currentTheme === theme.id && (
                  <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
