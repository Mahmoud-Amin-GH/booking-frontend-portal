import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  Snackbar, 
  Alert, 
  Button, 
  Box,
  IconButton
} from '@mui/material';
import { 
  CheckCircle, 
  Error as ErrorIcon, 
  Warning, 
  Info, 
  Close 
} from '@mui/icons-material';

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
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const contextValue = { showToast, removeToast };

  // Convert position to MUI anchor origin
  const getAnchorOrigin = (pos: string) => {
    switch (pos) {
      case 'top-right':
        return { vertical: 'top' as const, horizontal: 'right' as const };
      case 'top-left':
        return { vertical: 'top' as const, horizontal: 'left' as const };
      case 'bottom-right':
        return { vertical: 'bottom' as const, horizontal: 'right' as const };
      case 'bottom-left':
        return { vertical: 'bottom' as const, horizontal: 'left' as const };
      case 'top-center':
        return { vertical: 'top' as const, horizontal: 'center' as const };
      case 'bottom-center':
        return { vertical: 'bottom' as const, horizontal: 'center' as const };
      default:
        return { vertical: 'top' as const, horizontal: 'right' as const };
    }
  };

  const anchorOrigin = getAnchorOrigin(position);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast, index) => (
        <ToastSnackbar
          key={toast.id}
          toast={toast}
          anchorOrigin={anchorOrigin}
          index={index}
          onRemove={removeToast}
        />
      ))}
    </ToastContext.Provider>
  );
};

interface ToastSnackbarProps {
  toast: ToastItem;
  anchorOrigin: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
  index: number;
  onRemove: (id: string) => void;
}

const ToastSnackbar: React.FC<ToastSnackbarProps> = ({ 
  toast, 
  anchorOrigin, 
  index, 
  onRemove 
}) => {
  const handleClose = () => {
    onRemove(toast.id);
  };

  const handleActionClick = () => {
    if (toast.action) {
      toast.action.onClick();
      handleClose();
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'warning':
        return <Warning fontSize="small" />;
      case 'info':
        return <Info fontSize="small" />;
      default:
        return null;
    }
  };

  const getSeverity = () => {
    switch (toast.type) {
      case 'success':
        return 'success' as const;
      case 'error':
        return 'error' as const;
      case 'warning':
        return 'warning' as const;
      case 'info':
        return 'info' as const;
      default:
        return 'info' as const;
    }
  };

  // Calculate offset for stacked toasts
  const offsetY = index * 60; // 60px spacing between toasts
  const transformStyle = anchorOrigin.vertical === 'top' 
    ? `translateY(${offsetY}px)` 
    : `translateY(-${offsetY}px)`;

  return (
    <Snackbar
      open={true}
      autoHideDuration={toast.duration || 5000}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      sx={{
        transform: transformStyle,
        position: 'fixed',
        zIndex: 1400 + index, // Ensure proper stacking
      }}
    >
      <Alert
        onClose={handleClose}
        severity={getSeverity()}
        icon={getIcon()}
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 1.5,
          '& .MuiAlert-message': {
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {toast.action && (
              <Button
                onClick={handleActionClick}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
              >
                {toast.action.label}
              </Button>
            )}
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: 'inherit',
                p: 0.5,
              }}
              aria-label="Close notification"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <Box>
          {toast.title && (
            <Box 
              component="span" 
              sx={{ 
                fontWeight: 'medium', 
                fontSize: '0.875rem', 
                lineHeight: 1.25,
                display: 'block',
                mb: toast.message ? 0.25 : 0,
              }}
            >
              {toast.title}
            </Box>
          )}
          <Box 
            component="span" 
            sx={{ 
              fontSize: '0.875rem', 
              lineHeight: 1.25 
            }}
          >
            {toast.message}
          </Box>
        </Box>
      </Alert>
    </Snackbar>
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