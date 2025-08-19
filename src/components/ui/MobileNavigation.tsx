import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTouchGestures } from '../../hooks/useTouchGestures';
import { useResponsive } from '../../hooks/useResponsive';

export interface MobileNavigationProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
  isOpen,
  onClose,
  position = 'left',
  className = '',
}) => {
  const { isMobile } = useResponsive();
  
  const touchGestures = useTouchGestures({
    onSwipeLeft: position === 'right' ? onClose : undefined,
    onSwipeRight: position === 'left' ? onClose : undefined,
    onSwipeDown: position === 'bottom' ? onClose : undefined,
    minSwipeDistance: 100,
  });

  if (!isMobile) {
    return null;
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'left':
        return {
          left: 0,
          top: 0,
          bottom: 0,
          width: '80%',
          maxWidth: '300px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        };
      case 'right':
        return {
          right: 0,
          top: 0,
          bottom: 0,
          width: '80%',
          maxWidth: '300px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        };
      case 'bottom':
        return {
          left: 0,
          right: 0,
          bottom: 0,
          height: '60%',
          maxHeight: '500px',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
            onClick={onClose}
          />
          
          {/* Navigation Panel */}
          <motion.div
            initial={{ 
              transform: position === 'left' ? 'translateX(-100%)' : 
                        position === 'right' ? 'translateX(100%)' : 'translateY(100%)'
            }}
            animate={{ 
              transform: 'translateX(0) translateY(0)'
            }}
            exit={{ 
              transform: position === 'left' ? 'translateX(-100%)' : 
                        position === 'right' ? 'translateX(100%)' : 'translateY(100%)'
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              backgroundColor: 'white',
              zIndex: 1001,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              ...getPositionStyles(),
            }}
            className={className}
            {...touchGestures}
          >
            {/* Handle for swipe gestures */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: position === 'left' ? '8px' : position === 'right' ? 'auto' : '50%',
                right: position === 'right' ? '8px' : 'auto',
                transform: 'translateY(-50%)',
                width: position === 'bottom' ? '40px' : '4px',
                height: position === 'bottom' ? '4px' : '40px',
                backgroundColor: '#e0e0e0',
                borderRadius: '2px',
                margin: position === 'bottom' ? '0 auto' : '0',
              }}
            />
            
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
