import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { styleUtils } from '../../design-system/styleUtils';
import { colors, spacing, borderRadius, shadows, zIndex } from '../../design-system/theme';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fullScreen?: boolean;
  centered?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  style = {},
  header,
  footer,
  fullScreen = false,
  centered = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    // Блокируем скролл body
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const backdropStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.states.overlay,
    display: 'flex',
    alignItems: centered ? 'center' : 'flex-start',
    justifyContent: 'center',
    zIndex: zIndex.modal,
    padding: fullScreen ? 0 : spacing.lg,
  };

  const modalStyles = styleUtils.createModalStyles(size);
  
  const contentStyles: React.CSSProperties = {
    ...modalStyles,
    width: fullScreen ? '100vw' : 'auto',
    height: fullScreen ? '100vh' : 'auto',
    maxWidth: fullScreen ? 'none' : modalStyles.maxWidth,
    maxHeight: fullScreen ? 'none' : modalStyles.maxHeight,
    margin: fullScreen ? 0 : 'auto',
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.text.primary,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  const bodyStyles: React.CSSProperties = {
    flex: 1,
    padding: spacing.xl,
    overflow: 'auto',
  };

  const footerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.xl,
    paddingTop: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div style={backdropStyles} onClick={handleBackdropClick}>
      <div className={className} style={contentStyles}>
        {(header || title || showCloseButton) && (
          <div style={headerStyles}>
            {header || (title && <h2 style={titleStyles}>{title}</h2>)}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={closeButtonStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.states.hover;
                  e.currentTarget.style.color = colors.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.text.secondary;
                }}
                title="Закрыть"
              >
                <X size={20} />
              </button>
            )}
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
    </div>
  );
};

export default React.memo(Modal);
