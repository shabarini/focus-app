import React from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';
import { useTouchGestures } from '../../hooks/useTouchGestures';

export interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  onLongPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  style = {},
  icon,
  iconPosition = 'left',
  ariaLabel,
}) => {
  const { isTouchDevice } = useResponsive();

  const touchGestures = useTouchGestures({
    onTap: onClick,
    onLongPress,
    longPressDelay: 800,
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#7FB69E',
          color: 'white',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: '#7FB69E',
          border: '1px solid #7FB69E',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#666',
          border: 'none',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    const baseSize = isTouchDevice ? 44 : 36; // Минимальный размер для touch устройств
    
    switch (size) {
      case 'sm':
        return {
          padding: `${(baseSize - 24) / 2}px 12px`,
          fontSize: '14px',
          minHeight: `${baseSize}px`,
        };
      case 'md':
        return {
          padding: `${(baseSize - 20) / 2}px 16px`,
          fontSize: '16px',
          minHeight: `${baseSize}px`,
        };
      case 'lg':
        return {
          padding: `${(baseSize - 16) / 2}px 20px`,
          fontSize: '18px',
          minHeight: `${baseSize}px`,
        };
      default:
        return {};
    }
  };

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  const iconStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <motion.button
      style={buttonStyles}
      className={className}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      {...(isTouchDevice ? touchGestures : {})}
      onClick={!isTouchDevice ? onClick : undefined}
    >
      {icon && iconPosition === 'left' && (
        <span style={iconStyles}>{icon}</span>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && (
        <span style={iconStyles}>{icon}</span>
      )}
    </motion.button>
  );
};

export default TouchButton;
