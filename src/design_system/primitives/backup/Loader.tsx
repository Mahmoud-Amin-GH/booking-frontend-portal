import React from 'react';
import { CircularProgress, LinearProgress, Box } from '@mui/material';

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'linear';
  color?: 'primary' | 'secondary' | 'inherit';
  className?: string;
  label?: string;
  sx?: any;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium',
  variant = 'circular',
  color = 'primary',
  className = '',
  label,
  sx
}) => {
  // Size mapping for circular progress
  const getSizeValue = (size: string): number => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 24;
    }
  };

  // Linear progress height mapping
  const getLinearHeight = (size: string): number => {
    switch (size) {
      case 'small': return 4;
      case 'medium': return 6;
      case 'large': return 8;
      default: return 6;
    }
  };

  if (variant === 'linear') {
    return (
      <Box 
        className={className}
        sx={{ 
          width: '100%',
          ...sx 
        }}
        role="progressbar" 
        aria-label={label || 'Loading'}
      >
        <LinearProgress
          color={color === 'inherit' ? 'inherit' : color}
          sx={{
            height: getLinearHeight(size),
            borderRadius: 1,
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
            },
          }}
        />
      </Box>
    );
  }

  // Circular variant
  return (
    <Box 
      className={className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      role="progressbar" 
      aria-label={label || 'Loading'}
    >
      <CircularProgress
        size={getSizeValue(size)}
        color={color === 'inherit' ? 'inherit' : color}
        thickness={size === 'large' ? 3.6 : 4}
      />
    </Box>
  );
};

export default Loader; 