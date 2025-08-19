import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  mobilePadding?: number;
  tabletPadding?: number;
  desktopPadding?: number;
  maxWidth?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  style = {},
  mobilePadding = 16,
  tabletPadding = 24,
  desktopPadding = 32,
  maxWidth = {
    mobile: 100,
    tablet: 768,
    desktop: 1024,
  },
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getResponsiveStyles = (): React.CSSProperties => {
    let padding: number;
    let maxWidthValue: number;

    if (isMobile) {
      padding = mobilePadding;
      maxWidthValue = maxWidth.mobile || 100;
    } else if (isTablet) {
      padding = tabletPadding;
      maxWidthValue = maxWidth.tablet || 768;
    } else {
      padding = desktopPadding;
      maxWidthValue = maxWidth.desktop || 1024;
    }

    return {
      width: '100%',
      maxWidth: `${maxWidthValue}px`,
      margin: '0 auto',
      padding: `${padding}px`,
      boxSizing: 'border-box',
      ...style,
    };
  };

  return (
    <div className={className} style={getResponsiveStyles()}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
