import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  return (
    <img 
      src="/logo-true.png"
      alt="FOCUS Logo"
      width={size}
      height={size}
      className={className}
      style={{ 
        display: 'block',
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo;
