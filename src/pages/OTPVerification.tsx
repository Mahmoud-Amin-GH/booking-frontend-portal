import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Paper, Avatar } from '@mui/material';
import { Button, Input, Alert, Typography, Icon } from '../design_system';
import { LanguageSwitcher, Form } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';
import { authAPI } from '../services/api';

interface OTPFormData {
  code: string;
}

const OTPVerification: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OTPFormData>();

  const otpValue = watch('code', '');

  useEffect(() => {
    // Get phone number from localStorage
    const tempPhone = localStorage.getItem('temp_phone');
    if (!tempPhone) {
      navigate('/login');
      return;
    }
    setPhone(tempPhone);
  }, [navigate]);

  useEffect(() => {
    // Start countdown timer for resend OTP
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.verifyOTP({
        phone: phone,
        code: data.code,
      });

      // Clear temporary data
      localStorage.removeItem('temp_user_id');
      localStorage.removeItem('temp_phone');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t('error.otpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError(null);
    
    try {
      // In a real implementation, you would call a resend OTP API
      console.log('Resend OTP for:', phone);
      
      // Start countdown timer
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.error || t('error.resendFailed'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          width: '100%',
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          variant="text"
          onClick={() => navigate('/login')}
          icon={<Icon name={isRTL ? "arrow-right" : "arrow-left"} />}
          iconPosition="start"
        >
          {t('auth.back')}
        </Button>
        <LanguageSwitcher />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                }}
              >
                <Icon name="phone" />
              </Avatar>
              
              <Typography variant="display-small" color="primary" gutterBottom>
                {t('auth.verifyPhone')}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body-medium" color="on-surface-variant" gutterBottom>
                  {t('auth.enterOTP')}
                </Typography>
                <Typography variant="label-large" color="on-surface">
                  {phone}
                </Typography>
              </Box>
            </Box>

            {/* OTP Form */}
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                mb: 4,
              }}
            >
              {error && (
                <Alert 
                  variant="error" 
                  message={error}
                  dismissible
                  onDismiss={() => setError(null)}
                />
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 3, 
                  mt: error ? 3 : 0 
                }}
              >
                <Input
                  label={t('auth.otp')}
                  type="text"
                  placeholder="000000"
                  {...register('code', {
                    required: t('validation.required'),
                    pattern: {
                      value: /^\d{6}$/,
                      message: t('placeholders.otpError'),
                    },
                    maxLength: {
                      value: 6,
                      message: t('placeholders.otpError'),
                    },
                  })}
                  error={errors.code?.message}
                  helperText={t('placeholders.otpHelper')}
                  className="otp-input"
                />

                <Button
                  type="submit"
                  variant="filled"
                  size="large"
                  fullWidth
                  isLoading={isLoading}
                  disabled={otpValue.length !== 6}
                >
                  {t('auth.verify')}
                </Button>
              </Box>
            </Paper>

            {/* Resend Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body-2xs" color="on-surface-variant" gutterBottom>
                {t('auth.didntReceiveCode')}
              </Typography>
              
              {countdown > 0 ? (
                <Typography variant="body-2xs" color="on-surface-variant">
                  {t('auth.resendAvailable', { seconds: countdown })}
                </Typography>
              ) : (
                <Button
                  variant="text"
                  onClick={handleResendOTP}
                  isLoading={isResending}
                  disabled={isResending}
                >
                  {t('auth.resendOTP')}
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default OTPVerification; 