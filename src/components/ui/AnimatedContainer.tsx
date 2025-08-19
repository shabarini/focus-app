import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  key?: string | number;
  id?: string;
  role?: string;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  style = {},
  animation = 'fade',
  duration = 0.3,
  delay = 0,
  key,
  id,
  role,
}) => {
  const getAnimationProps = () => {
    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration, delay },
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: { duration, delay },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { duration, delay },
        };
      case 'none':
      default:
        return {};
    }
  };

  const motionProps = getAnimationProps();

  if (animation === 'none') {
    return (
      <div className={className} style={style} id={id} role={role}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className={className}
        style={style}
        id={id}
        role={role}
        {...motionProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedContainer;
