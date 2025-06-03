import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  actions,
  className = '',
}) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus modal content
      modalRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = 'unset';
        
        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    fullscreen: 'max-w-none w-full h-full rounded-none',
  };

  const backdropClasses = `
    fixed inset-0 z-50
    bg-black/60
    flex items-center justify-center
    p-4
    ${size === 'fullscreen' ? 'p-0' : ''}
  `;

  const modalClasses = `
    relative w-full ${sizeClasses[size]}
    bg-white
    rounded-lg
    shadow-xl
    max-h-[90vh] overflow-hidden
    flex flex-col
    ${className}
  `;

  const headerClasses = `
    flex items-center justify-between
    px-6 py-4
    border-b border-md-sys-color-outline-variant
    ${!title && !showCloseButton ? 'hidden' : ''}
  `;

  const contentClasses = `
    flex-1 overflow-y-auto
    px-6 py-4
  `;

  const actionsClasses = `
    flex items-center justify-end gap-3
    px-6 py-4
    border-t border-md-sys-color-outline-variant
    ${isRTL ? 'flex-row-reverse' : ''}
  `;

  const modalContent = (
    <div 
      className={backdropClasses}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div className={headerClasses}>
          {title && (
            <h2 
              id="modal-title"
              className="text-xl font-semibold text-md-sys-color-on-surface"
            >
              {title}
            </h2>
          )}
          
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 -m-2 hover:bg-md-sys-color-surface-container-highest rounded-full transition-colors"
              aria-label={t('common.close')}
            >
              <Icon name="close" size="medium" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className={contentClasses}>
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className={actionsClasses}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Convenience component for confirm dialogs
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'default',
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  const actions = (
    <>
      <Button
        variant="text"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText || t('common.cancel')}
      </Button>
      <Button
        variant={variant === 'danger' ? 'filled' : 'filled'}
        onClick={handleConfirm}
        disabled={isLoading}
        isLoading={isLoading}
      >
        {confirmText || t('common.confirm')}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      actions={actions}
      closeOnBackdrop={!isLoading}
      closeOnEscape={!isLoading}
    >
      <p className="text-md-sys-color-on-surface">
        {message}
      </p>
    </Modal>
  );
}; 