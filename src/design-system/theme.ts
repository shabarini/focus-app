// Основные цвета
export const colors = {
  // Основная палитра
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Нейтральные цвета
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Семантические цвета
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Цвета для приложения FOCUS
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
  
  accent: {
    primary: '#7FB69E',
    today: '#3B82F6',
    todo: '#F59E0B',
    done: '#10B981',
  },
  
  // Состояния
  states: {
    hover: 'rgba(127, 182, 158, 0.1)',
    active: 'rgba(127, 182, 158, 0.2)',
    disabled: 'rgba(100, 116, 139, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  }
};

// Отступы и размеры
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
};

// Радиусы скругления
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

// Тени
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Типографика
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

// Веса шрифтов
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Переходы и анимации
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  
  default: 'all 200ms ease-in-out',
};

// Размеры компонентов
export const componentSizes = {
  // Кнопки
  button: {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      borderRadius: borderRadius.md,
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.md,
      borderRadius: borderRadius.md,
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: typography.fontSize.lg,
      borderRadius: borderRadius.lg,
    },
  },
  
  // Инпуты
  input: {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      borderRadius: borderRadius.md,
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.md,
      borderRadius: borderRadius.md,
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: typography.fontSize.lg,
      borderRadius: borderRadius.lg,
    },
  },
  
  // Карточки
  card: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    shadow: shadows.md,
  },
};

// Z-индексы
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Точки перелома для адаптивности
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Экспорт всей темы
export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  fontWeights,
  transitions,
  componentSizes,
  zIndex,
  breakpoints,
};

// Утилиты для создания стилей
export const createStyles = {
  // Создание стилей для кнопок
  button: (variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const baseStyles = {
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      fontWeight: fontWeights.medium,
      transition: transitions.default,
      outline: 'none',
      ...componentSizes.button[size],
    };

    const variants = {
      primary: {
        backgroundColor: colors.accent.primary,
        color: colors.text.inverse,
        '&:hover': {
          backgroundColor: colors.primary[600],
        },
        '&:active': {
          backgroundColor: colors.primary[700],
        },
        '&:disabled': {
          backgroundColor: colors.states.disabled,
          cursor: 'not-allowed',
        },
      },
      secondary: {
        backgroundColor: colors.surface,
        color: colors.text.primary,
        border: `1px solid ${colors.border}`,
        '&:hover': {
          backgroundColor: colors.states.hover,
          borderColor: colors.accent.primary,
        },
        '&:active': {
          backgroundColor: colors.states.active,
        },
        '&:disabled': {
          backgroundColor: colors.gray[100],
          color: colors.text.tertiary,
          cursor: 'not-allowed',
        },
      },
      danger: {
        backgroundColor: colors.error[500],
        color: colors.text.inverse,
        '&:hover': {
          backgroundColor: colors.error[600],
        },
        '&:active': {
          backgroundColor: colors.error[700],
        },
        '&:disabled': {
          backgroundColor: colors.states.disabled,
          cursor: 'not-allowed',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        '&:hover': {
          backgroundColor: colors.states.hover,
        },
        '&:active': {
          backgroundColor: colors.states.active,
        },
        '&:disabled': {
          color: colors.text.tertiary,
          cursor: 'not-allowed',
        },
      },
    };

    return { ...baseStyles, ...variants[variant] };
  },

  // Создание стилей для инпутов
  input: (size: 'sm' | 'md' | 'lg' = 'md') => {
    return {
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
      color: colors.text.primary,
      outline: 'none',
      transition: transitions.default,
      ...componentSizes.input[size],
      '&:focus': {
        borderColor: colors.accent.primary,
        boxShadow: `0 0 0 3px ${colors.accent.primary}20`,
      },
      '&:disabled': {
        backgroundColor: colors.gray[100],
        color: colors.text.tertiary,
        cursor: 'not-allowed',
      },
    };
  },

  // Создание стилей для карточек
  card: () => {
    return {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      ...componentSizes.card,
    };
  },

  // Создание стилей для модалов
  modal: () => {
    return {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      boxShadow: shadows['2xl'],
      border: `1px solid ${colors.border}`,
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
    };
  },
};

// Утилиты для создания цветовых схем
export const colorSchemes = {
  light: {
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    border: colors.border,
  },
  dark: {
    background: colors.gray[900],
    surface: colors.gray[800],
    text: {
      primary: colors.gray[100],
      secondary: colors.gray[300],
      tertiary: colors.gray[400],
      inverse: colors.gray[900],
    },
    border: colors.gray[700],
  },
};

// Утилиты для создания анимаций
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },
};

export default theme;
