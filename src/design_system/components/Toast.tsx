import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../primitives/Icon';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString();
    const newToast: ToastItem = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Limit the number of toasts
      return updated.slice(0, maxToasts);
    });

    // Auto-dismiss toast
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const contextValue = { showToast, removeToast };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer position={positionClasses[position]} toasts={toasts} />
      )}
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  position: string;
  toasts: ToastItem[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position, toasts }) => {
  const { removeToast } = useToast();

  const containerClasses = `
    fixed ${position} z-50
    flex flex-col gap-2
    max-w-sm w-full
    pointer-events-none
  `;

  const toastElements = toasts.map(toast => (
    <Toast key={toast.id} toast={toast} onRemove={removeToast} />
  ));

  return createPortal(
    <div className={containerClasses}>
      {toastElements}
    </div>,
    document.body
  );
};

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const { isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const handleActionClick = () => {
    if (toast.action) {
      toast.action.onClick();
      handleRemove();
    }
  };

  const getIconName = () => {
    switch (toast.type) {
      case 'success':
        return 'check';
      case 'error':
        return 'close';
      case 'warning':
        return 'close'; // We'll use 'close' as a warning icon for now
      case 'info':
        return 'close'; // We'll use 'close' as an info icon for now
      default:
        return 'close';
    }
  };

  const getTypeClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container border-md-sys-color-primary';
      case 'error':
        return 'bg-md-sys-color-error-container text-md-sys-color-on-error-container border-md-sys-color-error';
      case 'warning':
        return 'bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container border-md-sys-color-tertiary';
      case 'info':
        return 'bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container border-md-sys-color-secondary';
      default:
        return 'bg-md-sys-color-surface-container text-md-sys-color-on-surface border-md-sys-color-outline';
    }
  };

  const toastClasses = `
    pointer-events-auto
    flex items-start gap-3 p-4
    rounded-lg border shadow-lg
    transform transition-all duration-300 ease-out
    ${getTypeClasses()}
    ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : isRTL ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'}
    ${isRemoving ? 'scale-95 opacity-0' : ''}
  `;

  return (
    <div className={toastClasses}>
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon name={getIconName()} size="small" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-medium text-sm leading-5 mb-1">
            {toast.title}
          </p>
        )}
        <p className="text-sm leading-5">
          {toast.message}
        </p>
        {toast.action && (
          <button
            onClick={handleActionClick}
            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 -m-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Close notification"
      >
        <Icon name="close" size="small" />
      </button>
    </div>
  );
};

// Convenience hooks for different toast types
export const useSuccessToast = () => {
  const { showToast } = useToast();
  return useCallback((message: string, title?: string) => {
    showToast({ type: 'success', message, title });
  }, [showToast]);
};

export const useErrorToast = () => {
  const { showToast } = useToast();
  return useCallback((message: string, title?: string) => {
    showToast({ type: 'error', message, title });
  }, [showToast]);
};

export const useWarningToast = () => {
  const { showToast } = useToast();
  return useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', message, title });
  }, [showToast]);
};

export const useInfoToast = () => {
  const { showToast } = useToast();
  return useCallback((message: string, title?: string) => {
    showToast({ type: 'info', message, title });
  }, [showToast]);
}; 