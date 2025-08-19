import { useState, useCallback, useEffect } from 'react';

export interface AccessibilityState {
  isReducedMotion: boolean;
  isHighContrast: boolean;
  isScreenReader: boolean;
  announcements: string[];
}

export interface AccessibilityActions {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncements: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
}

export const useAccessibility = (): [AccessibilityState, AccessibilityActions] => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isScreenReader, setIsScreenReader] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Определяем предпочтения пользователя
  useEffect(() => {
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');

    setIsReducedMotion(mediaQueryReducedMotion.matches);
    setIsHighContrast(mediaQueryHighContrast.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQueryReducedMotion.addEventListener('change', handleReducedMotionChange);
    mediaQueryHighContrast.addEventListener('change', handleHighContrastChange);

    // Определяем использование скрин-ридера
    const checkScreenReader = () => {
      const hasScreenReader = document.querySelector('[aria-live]') !== null ||
                             navigator.userAgent.includes('NVDA') ||
                             navigator.userAgent.includes('JAWS') ||
                             navigator.userAgent.includes('VoiceOver');
      setIsScreenReader(hasScreenReader);
    };

    checkScreenReader();

    return () => {
      mediaQueryReducedMotion.removeEventListener('change', handleReducedMotionChange);
      mediaQueryHighContrast.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, `${priority}:${message}`]);
    
    // Автоматически очищаем объявления через 5 секунд
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(announcement => !announcement.includes(message)));
    }, 5000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion(prev => !prev);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => !prev);
  }, []);

  return [
    { isReducedMotion, isHighContrast, isScreenReader, announcements },
    { announce, clearAnnouncements, toggleReducedMotion, toggleHighContrast }
  ];
};
