import React from 'react';
import { Alert as MUIAlert, AlertTitle, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon, Info, CheckCircle, Warning, Error } from '@mui/icons-material';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant: AlertVariant;
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Custom styled Alert to match your existing design
const StyledAlert = styled(MUIAlert)<{ alertVariant: AlertVariant }>(({ theme, alertVariant }) => {
  const getVariantStyles = () => {
    switch (alertVariant) {
      case 'info':
        return {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.dark,
          '& .MuiAlert-icon': {
            color: theme.palette.info.main,
          },
        };
      case 'success':
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.dark,
          '& .MuiAlert-icon': {
            color: theme.palette.success.main,
          },
        };
      case 'warning':
        return {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.dark,
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main,
          },
        };
      case 'error':
        return {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.dark,
          '& .MuiAlert-icon': {
            color: theme.palette.error.main,
          },
        };
      default:
        return {};
    }
  };

  return {
    borderRadius: 12,
    border: 'none',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '& .MuiAlert-message': {
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
    '& .MuiAlert-action': {
      paddingTop: 0,
      paddingLeft: theme.spacing(1),
    },
    ...getVariantStyles(),
  };
});

// Icon mapping for variants
const getIcon = (variant: AlertVariant) => {
  switch (variant) {
    case 'info':
      return <Info />;
    case 'success':
      return <CheckCircle />;
    case 'warning':
      return <Warning />;
    case 'error':
      return <Error />;
    default:
      return <Info />;
  }
};

const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  title,
  dismissible = false,
  onDismiss,
  className,
  children,
}) => {
  return (
    <StyledAlert
      alertVariant={variant}
      severity={variant}
      icon={getIcon(variant)}
      className={className}
      action={
        dismissible && onDismiss ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onDismiss}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : undefined
      }
    >
      {title && (
        <AlertTitle
          sx={{
            fontWeight: 500,
            fontSize: '0.875rem',
            margin: 0,
            marginBottom: 0.5,
          }}
        >
          {title}
        </AlertTitle>
      )}
      <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
        {message}
        {children}
      </div>
    </StyledAlert>
  );
};

export default Alert; 