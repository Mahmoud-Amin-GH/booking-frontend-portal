import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button as MUIButton, Stack } from '@mui/material';
import { Alert, Typography, AuthLayout, HeroSection } from '../design_system';
import { authAPI } from '../services/api';

interface OTPFormData {
  code: string;
}

const OTPVerification: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [countdown, setCountdown] = useState(60);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string>('');

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

  const validateCode = (): boolean => {
    if (!code.trim()) {
      setCodeError(t('validation.required'));
      return false;
    }
    if (code.length !== 6) {
      setCodeError('Please enter 6-digit code');
      return false;
    }
    setCodeError('');
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCode()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authAPI.verifyOTP({
        phone: phone,
        code: code,
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

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(numericValue);
    if (codeError) setCodeError('');
  };

  return (
    <AuthLayout heroContent={<HeroSection />}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: 1.33,
              color: '#092B4C',
              marginBottom: 1,
            }}
          >
            Verify Phone Number
          </Typography>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: 1.5,
              color: '#505F79',
              marginBottom: 1,
            }}
          >
            Enter the 6-digit code sent to
          </Typography>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 600,
              fontSize: '16px',
              color: '#092B4C',
            }}
          >
            {phone}
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert 
              variant="error" 
              message={error}
              dismissible
              onDismiss={() => setError(null)}
            />
          )}

          <Stack spacing={1}>
            {/* OTP Input */}
            <TextField
              fullWidth
              placeholder="000000"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              error={Boolean(codeError)}
              helperText={codeError}
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: 'center',
                  fontSize: '24px',
                  letterSpacing: '8px',
                  fontWeight: 600,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  '& fieldset': {
                    borderColor: '#DCDFE3',
                  },
                  '&:hover fieldset': {
                    borderColor: '#DCDFE3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1D8EFF',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '16px',
                  fontFamily: 'SS Sakr Soft',
                  '&::placeholder': {
                    color: '#A8AFBB',
                    opacity: 1,
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontFamily: 'SS Sakr Soft',
                  fontSize: '14px',
                  color: '#6B788E',
                  textAlign: 'center',
                },
              }}
            />
          </Stack>

          {/* Submit Button */}
          <MUIButton
            type="submit"
            fullWidth
            disabled={isLoading}
            sx={{
              backgroundColor: '#1D8EFF',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '12px 16px',
              fontFamily: 'SS Sakr Soft',
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'none',
              boxShadow: '0px 0px 0px 1px rgba(235, 237, 240, 1)',
              '&:hover': {
                backgroundColor: '#0062FF',
              },
              '&:disabled': {
                backgroundColor: '#A8AFBB',
              },
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </MUIButton>
        </Box>

        {/* Resend Section */}
        <Box sx={{ textAlign: 'center' }}>
          {countdown > 0 ? (
            <Typography
              sx={{
                fontFamily: 'SS Sakr Soft',
                fontWeight: 500,
                fontSize: '14px',
                color: '#6B788E',
              }}
            >
              Resend code in {countdown}s
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#092B4C',
                }}
              >
                Didn't receive the code?
              </Typography>
              <MUIButton
                onClick={handleResendOTP}
                disabled={isResending}
                sx={{
                  color: '#0062FF',
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'none',
                  padding: '10px 0px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                  '&:disabled': {
                    color: '#A8AFBB',
                  },
                }}
              >
                {isResending ? 'Sending...' : 'Resend'}
              </MUIButton>
            </Box>
          )}
        </Box>

        {/* Back Button */}
        <Box sx={{ textAlign: 'center' }}>
          <MUIButton
            onClick={() => navigate('/login')}
            sx={{
              color: '#6B788E',
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '14px',
              textTransform: 'none',
              padding: '10px 0px',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            ← Back to Login
          </MUIButton>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default OTPVerification; 