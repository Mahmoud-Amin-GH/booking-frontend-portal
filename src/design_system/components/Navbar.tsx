import React from 'react';
import { Box, Button } from '@mui/material';

export const Navbar: React.FC = () => {
  const handleLanguageSwitch = () => {
    // Language switching logic would go here
    console.log('Switch language');
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #EBEDF0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 120px',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        {/* 4Sale Logo */}
        <Box
          component="img"
          src="/assets/4sale-logo.svg"
          alt="4Sale"
          sx={{
            height: 40,
            width: 'auto',
          }}
        />

        {/* Language Switcher */}
        <Button
          onClick={handleLanguageSwitch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#F5F6F7',
            },
          }}
        >
          {/* Kuwait Flag */}
          <Box
            component="img"
            src="/assets/kuwait-flag.png"
            alt="Kuwait"
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.5,
            }}
          />
          {/* Language Text */}
          <Box
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 700,
              fontSize: '14px',
              color: '#092B4C',
              lineHeight: 1.43,
            }}
          >
            ةيبرعلا
          </Box>
        </Button>
      </Box>
    </Box>
  );
}; 