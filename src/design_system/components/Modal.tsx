import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
  Typography as MuiTypography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import Button from '../primitives/Button';
import Typography from '../primitives/Typography';
import { useLanguage } from '../../contexts/LanguageContext';
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
  sx?: any;
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
  sx,
}) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  // Handle close events
  const handleClose = (_event: any, reason?: string) => {
    if (reason === 'backdropClick' && !closeOnBackdrop) return;
    if (reason === 'escapeKeyDown' && !closeOnEscape) return;
    onClose();
  };

  // Map size to MUI maxWidth
  const getMaxWidth = () => {
    switch (size) {
      case 'small':
        return 'sm';
      case 'medium':
        return 'md';
      case 'large':
        return 'lg';
      case 'fullscreen':
        return false;
      default:
        return 'md';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={getMaxWidth()}
      fullWidth
      fullScreen={size === 'fullscreen'}
      className={className}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2, // rounded-lg
          maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
          margin: size === 'fullscreen' ? 0 : 2,
          ...sx,
        },
      }}
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {title && (
            <MuiTypography
              variant="h6"
              component="h2"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {title}
            </MuiTypography>
          )}
          
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ ml: 'auto' }}
              aria-label={t('common.close')}
            >
              <Close />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          px: 3,
          py: 2,
          overflowY: 'auto',
        }}
      >
        {children}
      </DialogContent>

      {/* Actions */}
      {actions && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: 1.5,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
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
        sx={{
          ...(variant === 'danger' && {
            backgroundColor: 'error.main',
            color: 'error.contrastText',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }),
        }}
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
      <Typography
        variant="body-xs"
        sx={{ color: 'text.primary' }}
      >
        {message}
      </Typography>
    </Modal>
  );
}; 