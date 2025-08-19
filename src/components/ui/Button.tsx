import React from 'react';
import { styleUtils, StyleVariant, SizeVariant } from '../../design-system/styleUtils';

export interface ButtonProps {
  variant?: StyleVariant;
  size?: SizeVariant;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  // ARIA атрибуты для доступности
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
  role?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  style = {},
  title,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  ariaHasPopup,
  role,
}) => {
  const baseStyles = styleUtils.createButtonStyles(variant, size, disabled || loading);
  
  const buttonStyles: React.CSSProperties = {
    ...baseStyles,
    width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.7 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    ...style,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <button
      type={type}
      className={className}
      style={buttonStyles}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      role={role}
    >
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: iconPosition === 'left' ? '8px' : 0,
            marginLeft: iconPosition === 'right' ? '8px' : 0,
          }}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default React.memo(Button);
