import React from 'react';
import { CircularProgress, LinearProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'linear';
  color?: 'primary' | 'on-surface' | 'inherit';
  className?: string;
  label?: string;
}

// Custom styled CircularProgress to match existing design
const StyledCircularProgress = styled(CircularProgress)<{ loaderColor: LoaderProps['color'] }>(({ theme, loaderColor }) => {
  const getColor = () => {
    switch (loaderColor) {
      case 'primary':
        return theme.palette.primary.main;
      case 'on-surface':
        return theme.palette.text.primary;
      case 'inherit':
        return 'currentColor';
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    color: getColor(),
  };
});

// Custom styled LinearProgress to match existing design
const StyledLinearProgress = styled(LinearProgress)<{ loaderColor: LoaderProps['color'] }>(({ theme, loaderColor }) => {
  const getColor = () => {
    switch (loaderColor) {
      case 'primary':
        return {
          backgroundColor: `${theme.palette.primary.main}33`, // 20% opacity
          '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.primary.main,
          },
        };
      case 'on-surface':
        return {
          backgroundColor: `${theme.palette.text.primary}33`, // 20% opacity
          '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.text.primary,
          },
        };
      case 'inherit':
        return {
          backgroundColor: 'currentColor',
          opacity: 0.2,
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'currentColor',
            opacity: 1,
          },
        };
      default:
        return {};
    }
  };

  return {
    borderRadius: 999, // Fully rounded
    ...getColor(),
  };
});

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium',
  variant = 'circular',
  color = 'primary',
  className,
  label
}) => {
  // Size mapping for circular progress
  const circularSizes = {
    small: 16,
    medium: 24,
    large: 32,
  };

  // Size mapping for linear progress
  const linearHeights = {
    small: 4,
    medium: 6,
    large: 8,
  };

  if (variant === 'linear') {
    return (
      <Box 
        className={className}
        role="progressbar" 
        aria-label={label || 'Loading'}
        sx={{ width: '100%' }}
      >
        <StyledLinearProgress
          loaderColor={color}
          sx={{
            height: linearHeights[size],
          }}
        />
      </Box>
    );
  }

  // Circular variant
  return (
    <Box 
      className={className}
      role="progressbar" 
      aria-label={label || 'Loading'}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StyledCircularProgress
        loaderColor={color}
        size={circularSizes[size]}
        thickness={size === 'large' ? 3.6 : 4}
      />
    </Box>
  );
};

export default Loader; 