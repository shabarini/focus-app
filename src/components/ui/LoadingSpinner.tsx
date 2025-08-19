import React from 'react';
import { motion } from 'framer-motion';
import { styleUtils } from '../../design-system/styleUtils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  className = '',
  text,
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = color || '#7FB69E';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  };

  return (
    <div style={containerStyle} className={className}>
      <motion.div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `2px solid #f3f3f3`,
          borderTop: `2px solid ${spinnerColor}`,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && <p style={textStyle}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
