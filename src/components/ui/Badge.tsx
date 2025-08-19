import React from 'react';
import { X } from 'lucide-react';
import { styleUtils, StyleVariant, SizeVariant } from '../../design-system/styleUtils';

export interface BadgeProps {
  variant?: StyleVariant;
  size?: SizeVariant;
  children: React.ReactNode;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onRemove,
  removable = false,
  className = '',
  style = {},
  icon,
  iconPosition = 'left',
}) => {
  const baseStyles = styleUtils.createBadgeStyles(variant, size);
  
  const badgeStyles: React.CSSProperties = {
    ...baseStyles,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    ...style,
  };

  const removeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'inherit',
    opacity: 0.7,
    transition: 'all 0.2s',
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span className={className} style={badgeStyles}>
      {icon && iconPosition === 'left' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      {removable && onRemove && (
        <button
          onClick={handleRemove}
          style={removeButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Удалить"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default React.memo(Badge);
