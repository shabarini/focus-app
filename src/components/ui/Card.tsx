import React from 'react';
import { styleUtils } from '../../design-system/styleUtils';
import { spacing } from '../../design-system/theme';

export interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  elevation = 'md',
  className = '',
  style = {},
  header,
  footer,
  padding = 'md',
  onClick,
  hoverable = false,
  bordered = true,
}) => {
  const baseStyles = styleUtils.createCardStyles(elevation);
  
  const paddingMap = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  };

  const cardStyles: React.CSSProperties = {
    ...baseStyles,
    border: bordered ? baseStyles.border : 'none',
    cursor: hoverable || onClick ? 'pointer' : 'default',
    transition: hoverable || onClick ? 'all 0.2s ease-in-out' : 'none',
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    padding: paddingMap[padding],
    paddingBottom: spacing.sm,
    borderBottom: header ? `1px solid ${baseStyles.border?.split(' ')[2]}` : 'none',
  };

  const bodyStyles: React.CSSProperties = {
    padding: paddingMap[padding],
  };

  const footerStyles: React.CSSProperties = {
    padding: paddingMap[padding],
    paddingTop: spacing.sm,
    borderTop: footer ? `1px solid ${baseStyles.border?.split(' ')[2]}` : 'none',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hoverable || onClick) {
      const element = e.currentTarget as HTMLElement;
      element.style.transform = 'translateY(-2px)';
      element.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (hoverable || onClick) {
      const element = e.currentTarget as HTMLElement;
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = baseStyles.boxShadow || 'none';
    }
  };

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {header && (
        <div style={headerStyles}>
          {header}
        </div>
      )}
      
      <div style={bodyStyles}>
        {children}
      </div>
      
      {footer && (
        <div style={footerStyles}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default React.memo(Card);
