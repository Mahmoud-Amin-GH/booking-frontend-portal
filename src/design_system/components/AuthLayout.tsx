import React from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from './Navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
  heroContent: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, heroContent }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F5F6F7',
      }}
    >
      {/* Navigation Bar */}
      <Navbar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Hero Section - Left Side (42%) */}
        <Box
          sx={{
            width: { xs: '100%', md: '42%' },
            background: 'linear-gradient(135deg, #F5F6F7 0%, #E8EBF0 100%)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: '40vh', md: '100vh' },
          }}
        >
          {heroContent}
        </Box>

        {/* Form Section - Right Side (58%) */}
        <Box
          sx={{
            width: { xs: '100%', md: '58%' },
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '60vh', md: '100vh' },
            padding: { xs: 2, md: 4 },
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              width: '100%',
              maxWidth: '486px',
              padding: { xs: 2, md: 3 },
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}; 