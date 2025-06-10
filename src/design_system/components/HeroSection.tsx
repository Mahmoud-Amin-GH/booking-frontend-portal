import React from 'react';
import { Box, Typography } from '@mui/material';

export const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: 3, md: 4 },
        overflow: 'hidden',
      }}
    >
      {/* Main Headlines */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          marginTop: { xs: 4, md: 8 },
          marginLeft: { xs: 0, md: 2 },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'SS Sakr Soft',
            fontWeight: 700,
            fontSize: { xs: '24px', md: '30px' },
            lineHeight: 1.33,
            letterSpacing: '-0.8%',
            color: '#092B4C',
            marginBottom: 1,
          }}
        >
          Buy, Sell or Rent.
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'SS Sakr Soft',
            fontWeight: 700,
            fontSize: { xs: '24px', md: '30px' },
            lineHeight: 1.33,
            letterSpacing: '-0.8%',
            color: '#092B4C',
          }}
        >
          Almost anything.
        </Typography>
      </Box>

      {/* Background Image */}
      <Box
        component="img"
        src="/assets/hero-background.png"
        alt="Hero background"
        sx={{
          position: 'absolute',
          top: { xs: '25%', md: '25%' },
          left: { xs: '8%', md: '12%' },
          width: { xs: '84%', md: '77%' },
          height: { xs: '60%', md: '65%' },
          objectFit: 'contain',
          objectPosition: 'center',
          zIndex: 1,
          maxWidth: '480px',
          maxHeight: '350px',
        }}
      />

      {/* Decorative Shape 1 - Top Left */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '20%', md: '18%' },
          left: { xs: '8%', md: '10%' },
          width: '27px',
          height: '22px',
          backgroundImage: 'url(/assets/decorative-shape-1.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          zIndex: 3,
          display: { xs: 'none', md: 'block' },
        }}
      />

      {/* Decorative Shape 2 - Bottom Right */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '8%', md: '5%' },
          right: { xs: '15%', md: '20%' },
          width: '33px',
          height: '40px',
          backgroundImage: 'url(/assets/decorative-shape-2.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          zIndex: 3,
          display: { xs: 'none', md: 'block' },
        }}
      />
    </Box>
  );
}; 