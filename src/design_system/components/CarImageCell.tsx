import React from 'react';
import { Box, Typography } from '@mui/material';

interface CarImageCellProps {
  carName: string;
  carImage?: string;
}

export const CarImageCell: React.FC<CarImageCellProps> = ({ carName, carImage }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        padding: '16px 12px',
        width: '243px', // Fixed width as per Figma
      }}
    >
      {/* Car Name */}
      <Typography
        sx={{
          fontFamily: 'SS Sakr Soft',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: 1.43,
          color: '#021442',
          textAlign: 'right',
          flex: 1,
        }}
      >
        {carName}
      </Typography>
      
      {/* Car Image */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '4px',
          backgroundColor: '#F7F8FA',
          backgroundImage: carImage ? `url(${carImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {!carImage && (
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: '#E9EBF2',
              borderRadius: '2px',
            }}
          />
        )}
      </Box>
    </Box>
  );
}; 