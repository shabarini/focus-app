import React from 'react';
import { motion } from 'framer-motion';

export interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  children = 'Перейти к основному содержимому',
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`skip-link ${className}`}
      style={{
        position: 'absolute',
        left: '6px',
        background: '#7FB69E',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
      }}
      initial={{ top: '-40px' }}
      whileFocus={{ top: '6px' }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.a>
  );
};

export default SkipLink;
