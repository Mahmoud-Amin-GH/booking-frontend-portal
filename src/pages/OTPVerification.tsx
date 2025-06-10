import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { Box, TextField, Button as MUIButton } from '@mui/material';
import {
  Alert,
  Typography
} from '../design_system';
import { AuthLayout } from '../design_system/components/AuthLayout';
import { HeroSection } from '../design_system/components/HeroSection';
import { authAPI, OTPRequest } from '../services/api';

const OTPVerification: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Get phone number from navigation state
  const phone = location.state?.phone || localStorage.getItem('temp_phone') || '';
  const fromSignup = location.state?.fromSignup || false;

  useEffect(() => {
    if (!phone) {
      // If no phone number, redirect to signup
      navigate('/signup');
      return;
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phone, navigate]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      if (serverError) {
        setServerError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setServerError(t('placeholders.otpError'));
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const otpData: OTPRequest = {
        phone: phone,
        code: otp
      };
      
      const response = await authAPI.verifyOTP(otpData);

      if (response.token) {
        // OTP verification successful
        navigate('/dashboard');
      } else {
        setServerError(t('error.otpFailed'));
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setServerError(error.response?.data?.error || t('error.otpFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setServerError('');

    try {
      // Call resend OTP API (this would typically be a separate endpoint)
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset countdown
      setCanResend(false);
      setCountdown(30);
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setServerError(t('error.resendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const maskedPhone = phone ? phone.replace(/(\+965\s\d{2})\d{2}(\s\d{4})/, '$1**$2') : '';

  return (
    <AuthLayout heroContent={<HeroSection />}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Header */}
        <Box sx={{ marginBottom: '32px', textAlign: 'center' }}>
          <Typography 
            variant="headline-large" 
            sx={{ 
              fontFamily: 'SS Sakr Soft',
              fontWeight: 700,
              fontSize: '32px',
              lineHeight: '40px',
              color: '#092B4C',
              marginBottom: '8px'
            }}
          >
            {t('auth.verifyPhone')}
          </Typography>
          <Typography 
            variant="body-large"
            sx={{ 
              fontFamily: 'SS Sakr Soft',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#6B7280',
              marginBottom: '16px'
            }}
          >
            {t('placeholders.otpHelper')}
          </Typography>
          <Typography 
            variant="body-medium"
            sx={{ 
              fontFamily: 'SS Sakr Soft',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#092B4C'
            }}
          >
            {maskedPhone}
          </Typography>
        </Box>

        {/* Error Alert */}
        {serverError && (
          <Alert 
            variant="error" 
            message={serverError}
            sx={{ marginBottom: '24px' }}
            dismissible
            onDismiss={() => setServerError('')}
          />
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* OTP Input */}
          <Box sx={{ marginBottom: '24px' }}>
            <Typography 
              variant="label-large"
              sx={{ 
                fontFamily: 'SS Sakr Soft',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#374151',
                marginBottom: '8px',
                display: 'block',
                textAlign: isRTL ? 'right' : 'left'
              }}
            >
              {t('auth.otp')}
            </Typography>
            <TextField
              fullWidth
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              inputMode="numeric"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'SS Sakr Soft',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1D8EFF',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1D8EFF',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  letterSpacing: '0.5rem',
                },
              }}
            />
          </Box>

          {/* Submit Button */}
          <MUIButton
            type="submit"
            fullWidth
            disabled={loading || otp.length !== 6}
            sx={{
              borderRadius: '8px',
              padding: '12px 24px',
              backgroundColor: '#1D8EFF',
              color: '#FFFFFF',
              fontFamily: 'SS Sakr Soft',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              textTransform: 'none',
              marginBottom: '24px',
              '&:hover': {
                backgroundColor: '#1570CD',
              },
              '&:disabled': {
                backgroundColor: '#E5E7EB',
                color: '#9CA3AF',
              },
            }}
          >
            {loading ? t('common.loading') : t('auth.verify')}
          </MUIButton>

          {/* Resend OTP */}
          <Box sx={{ textAlign: 'center', marginBottom: '24px' }}>
            <Typography 
              variant="body-medium"
              sx={{ 
                fontFamily: 'SS Sakr Soft',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#6B7280',
                marginBottom: '8px'
              }}
            >
              {t('auth.didntReceiveCode')}
            </Typography>
            
            {canResend ? (
              <MUIButton
                onClick={handleResendOTP}
                disabled={loading}
                sx={{
                  color: '#1D8EFF',
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'none',
                  padding: '4px 8px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('auth.resendOTP')}
              </MUIButton>
            ) : (
              <Typography 
                variant="body-small"
                sx={{ 
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#9CA3AF'
                }}
              >
                {t('auth.resendAvailable', { seconds: countdown })}
              </Typography>
            )}
          </Box>

          {/* Back Button */}
          <MUIButton
            fullWidth
            variant="outlined"
            onClick={handleBackToLogin}
            sx={{
              borderRadius: '8px',
              padding: '12px 24px',
              borderColor: '#D1D5DB',
              color: '#374151',
              fontFamily: 'SS Sakr Soft',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            {t('auth.back')}
          </MUIButton>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default OTPVerification; 