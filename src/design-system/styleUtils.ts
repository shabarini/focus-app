import { theme, createStyles, colors, spacing, borderRadius, shadows, typography, fontWeights, transitions } from './theme';

// Типы для стилей
export type StyleVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning';
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Утилиты для создания стилей
export const styleUtils = {
  // Создание стилей для кнопок с использованием дизайн-системы
  createButtonStyles: (variant: StyleVariant = 'primary', size: SizeVariant = 'md', disabled = false) => {
    const baseStyles = {
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      fontWeight: fontWeights.medium,
      transition: transitions.default,
      outline: 'none',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize[size === 'xs' ? 'xs' : size === 'lg' ? 'lg' : 'md'],
      padding: size === 'xs' ? `${spacing.xs} ${spacing.sm}` :
               size === 'sm' ? `${spacing.sm} ${spacing.md}` :
               size === 'lg' ? `${spacing.lg} ${spacing.xl}` :
               size === 'xl' ? `${spacing.xl} ${spacing['2xl']}` :
               `${spacing.md} ${spacing.lg}`,
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.states.disabled : colors.accent.primary,
        color: colors.text.inverse,
        '&:hover': disabled ? {} : { backgroundColor: colors.primary[600] },
        '&:active': disabled ? {} : { backgroundColor: colors.primary[700] },
      },
      secondary: {
        backgroundColor: disabled ? colors.gray[100] : colors.surface,
        color: disabled ? colors.text.tertiary : colors.text.primary,
        border: `1px solid ${colors.border}`,
        '&:hover': disabled ? {} : { 
          backgroundColor: colors.states.hover,
          borderColor: colors.accent.primary 
        },
        '&:active': disabled ? {} : { backgroundColor: colors.states.active },
      },
      danger: {
        backgroundColor: disabled ? colors.states.disabled : colors.error[500],
        color: colors.text.inverse,
        '&:hover': disabled ? {} : { backgroundColor: colors.error[600] },
        '&:active': disabled ? {} : { backgroundColor: colors.error[700] },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: disabled ? colors.text.tertiary : colors.text.primary,
        '&:hover': disabled ? {} : { backgroundColor: colors.states.hover },
        '&:active': disabled ? {} : { backgroundColor: colors.states.active },
      },
      success: {
        backgroundColor: disabled ? colors.states.disabled : colors.success[500],
        color: colors.text.inverse,
        '&:hover': disabled ? {} : { backgroundColor: colors.success[600] },
        '&:active': disabled ? {} : { backgroundColor: colors.success[700] },
      },
      warning: {
        backgroundColor: disabled ? colors.states.disabled : colors.warning[500],
        color: colors.text.inverse,
        '&:hover': disabled ? {} : { backgroundColor: colors.warning[600] },
        '&:active': disabled ? {} : { backgroundColor: colors.warning[700] },
      },
    };

    return { ...baseStyles, ...variantStyles[variant] };
  },

  // Создание стилей для инпутов
  createInputStyles: (size: SizeVariant = 'md', error = false, disabled = false) => {
    return {
      border: `1px solid ${error ? colors.error[500] : colors.border}`,
      backgroundColor: disabled ? colors.gray[100] : colors.surface,
      color: disabled ? colors.text.tertiary : colors.text.primary,
      outline: 'none',
      transition: transitions.default,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize[size === 'xs' ? 'xs' : size === 'lg' ? 'lg' : 'md'],
      padding: size === 'xs' ? `${spacing.xs} ${spacing.sm}` :
               size === 'sm' ? `${spacing.sm} ${spacing.md}` :
               size === 'lg' ? `${spacing.lg} ${spacing.xl}` :
               size === 'xl' ? `${spacing.xl} ${spacing['2xl']}` :
               `${spacing.md} ${spacing.lg}`,
      cursor: disabled ? 'not-allowed' : 'text',
      '&:focus': {
        borderColor: error ? colors.error[500] : colors.accent.primary,
        boxShadow: `0 0 0 3px ${error ? colors.error[100] : colors.accent.primary}20`,
      },
      '&:disabled': {
        backgroundColor: colors.gray[100],
        color: colors.text.tertiary,
        cursor: 'not-allowed',
      },
    };
  },

  // Создание стилей для карточек
  createCardStyles: (elevation: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    return {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      boxShadow: shadows[elevation],
    };
  },

  // Создание стилей для модалов
  createModalStyles: (size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    const sizeStyles = {
      sm: { maxWidth: '400px' },
      md: { maxWidth: '600px' },
      lg: { maxWidth: '800px' },
      xl: { maxWidth: '1200px' },
    };

    return {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      boxShadow: shadows['2xl'],
      border: `1px solid ${colors.border}`,
      maxHeight: '90vh',
      overflow: 'auto',
      ...sizeStyles[size],
    };
  },

  // Создание стилей для бейджей/тегов
  createBadgeStyles: (variant: StyleVariant = 'primary', size: SizeVariant = 'md') => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.full,
      fontWeight: fontWeights.medium,
      fontSize: typography.fontSize[size === 'xs' ? 'xs' : 'sm'],
      padding: size === 'xs' ? `${spacing.xs} ${spacing.sm}` :
               size === 'sm' ? `${spacing.sm} ${spacing.md}` :
               size === 'lg' ? `${spacing.md} ${spacing.lg}` :
               `${spacing.sm} ${spacing.md}`,
    };

    const variantStyles = {
      primary: {
        backgroundColor: colors.accent.primary + '20',
        color: colors.accent.primary,
      },
      secondary: {
        backgroundColor: colors.gray[100],
        color: colors.text.secondary,
      },
      danger: {
        backgroundColor: colors.error[100],
        color: colors.error[700],
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.secondary,
        border: `1px solid ${colors.border}`,
      },
      success: {
        backgroundColor: colors.success[100],
        color: colors.success[700],
      },
      warning: {
        backgroundColor: colors.warning[100],
        color: colors.warning[700],
      },
    };

    return { ...baseStyles, ...variantStyles[variant] };
  },

  // Создание стилей для аватаров
  createAvatarStyles: (size: SizeVariant = 'md') => {
    const sizeMap = {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '64px',
    };

    return {
      width: sizeMap[size],
      height: sizeMap[size],
      borderRadius: borderRadius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent.primary,
      color: colors.text.inverse,
      fontSize: typography.fontSize[size === 'xs' ? 'xs' : size === 'lg' ? 'lg' : 'md'],
      fontWeight: fontWeights.medium,
    };
  },

  // Создание стилей для прогресс-баров
  createProgressStyles: (variant: StyleVariant = 'primary') => {
    const variantColors = {
      primary: colors.accent.primary,
      secondary: colors.gray[400],
      danger: colors.error[500],
      success: colors.success[500],
      warning: colors.warning[500],
      ghost: colors.gray[300],
    };

    return {
      container: {
        width: '100%',
        height: '8px',
        backgroundColor: colors.gray[200],
        borderRadius: borderRadius.full,
        overflow: 'hidden',
      },
      bar: {
        height: '100%',
        backgroundColor: variantColors[variant],
        borderRadius: borderRadius.full,
        transition: transitions.default,
      },
    };
  },

  // Создание стилей для спиннеров/лоадеров
  createSpinnerStyles: (size: SizeVariant = 'md', variant: StyleVariant = 'primary') => {
    const sizeMap = {
      xs: '16px',
      sm: '20px',
      md: '24px',
      lg: '32px',
      xl: '40px',
    };

    const variantColors = {
      primary: colors.accent.primary,
      secondary: colors.gray[400],
      danger: colors.error[500],
      success: colors.success[500],
      warning: colors.warning[500],
      ghost: colors.gray[300],
    };

    return {
      width: sizeMap[size],
      height: sizeMap[size],
      border: `2px solid ${colors.gray[200]}`,
      borderTop: `2px solid ${variantColors[variant]}`,
      borderRadius: borderRadius.full,
      animation: 'spin 1s linear infinite',
    };
  },
};

// Утилиты для создания анимаций
export const animationUtils = {
  // Fade in анимация
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },

  // Slide up анимация
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },

  // Scale in анимация
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },

  // Slide in from left
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },

  // Slide in from right
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: transitions.duration.normal,
    easing: transitions.easing.easeOut,
  },

  // Bounce анимация
  bounce: {
    from: { transform: 'scale(0.3)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: transitions.duration.slow,
    easing: transitions.easing.easeOut,
  },
};

// Утилиты для создания layout стилей
export const layoutUtils = {
  // Flexbox утилиты
  flex: {
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    between: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    start: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    end: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    columnCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // Grid утилиты
  grid: {
    center: {
      display: 'grid',
      placeItems: 'center',
    },
    columns: (count: number) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${count}, 1fr)`,
      gap: spacing.md,
    }),
    responsive: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: spacing.md,
    },
  },

  // Spacing утилиты
  spacing: {
    stack: (space: keyof typeof spacing = 'md') => ({
      '& > * + *': {
        marginTop: spacing[space],
      },
    }),
    inline: (space: keyof typeof spacing = 'md') => ({
      '& > * + *': {
        marginLeft: spacing[space],
      },
    }),
  },
};

// Утилиты для создания responsive стилей
export const responsiveUtils = {
  // Медиа-запросы
  media: {
    xs: `@media (min-width: ${theme.breakpoints.xs})`,
    sm: `@media (min-width: ${theme.breakpoints.sm})`,
    md: `@media (min-width: ${theme.breakpoints.md})`,
    lg: `@media (min-width: ${theme.breakpoints.lg})`,
    xl: `@media (min-width: ${theme.breakpoints.xl})`,
    '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
  },

  // Responsive значения
  responsive: <T>(values: Partial<Record<keyof typeof theme.breakpoints, T>>) => values,
};

// Утилиты для создания состояний
export const stateUtils = {
  // Hover состояния
  hover: (styles: React.CSSProperties) => ({
    '&:hover': styles,
  }),

  // Focus состояния
  focus: (styles: React.CSSProperties) => ({
    '&:focus': styles,
  }),

  // Active состояния
  active: (styles: React.CSSProperties) => ({
    '&:active': styles,
  }),

  // Disabled состояния
  disabled: (styles: React.CSSProperties) => ({
    '&:disabled': styles,
  }),

  // Комбинированные состояния
  interactive: (styles: React.CSSProperties) => ({
    '&:hover': styles,
    '&:focus': styles,
    '&:active': styles,
  }),
};

export default {
  styleUtils,
  animationUtils,
  layoutUtils,
  responsiveUtils,
  stateUtils,
};
