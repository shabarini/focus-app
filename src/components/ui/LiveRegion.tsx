import React, { useEffect, useRef } from 'react';

export interface LiveRegionProps {
  children: React.ReactNode;
  role?: 'status' | 'alert' | 'log' | 'timer';
  ariaLive?: 'polite' | 'assertive' | 'off';
  className?: string;
  clearOnUnmount?: boolean;
}

const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  role = 'status',
  ariaLive = 'polite',
  className = '',
  clearOnUnmount = true,
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (clearOnUnmount && regionRef.current) {
        regionRef.current.textContent = '';
      }
    };
  }, [clearOnUnmount]);

  return (
    <div
      ref={regionRef}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={`live-region ${className}`}
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default LiveRegion;
