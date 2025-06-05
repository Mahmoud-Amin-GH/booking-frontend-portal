import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Box, Alert as MUIAlert } from '@mui/material';
import { Button, Input, Typography, LanguageSwitcher } from '../design_system/mui';
import { authAPI, validateKuwaitiPhone } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useErrorToast } from '../design_system';
import * as Icons from '@mui/icons-material';

interface LoginFormData {
  phone: string;
  password: string;
}

const LoginMUI: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const showError = useErrorToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate phone number format
      if (!validateKuwaitiPhone(data.phone)) {
        setError(t('validation.phone'));
        setIsLoading(false);
        return;
      }

      const response = await authAPI.login(data);
      
      // Store user ID for OTP verification
      localStorage.setItem('temp_user_id', response.user_id?.toString() || '');
      localStorage.setItem('temp_phone', data.phone);
      
      // Navigate to OTP verification
      navigate('/verify-otp');
    } catch (err: any) {
      setError(err.response?.data?.error || t('error.loginFailed'));
    } finally {
      setIsLoading(false);
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
        sx={{
          width: '100%',
          p: 3,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
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
          <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', spacing: 4 }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="display-medium" color="primary" gutterBottom>
                {t('auth.login')}
              </Typography>
              <Typography variant="body-medium" color="on-surface-variant">
                {t('auth.welcomeBack')}
              </Typography>
            </Box>

            {/* Login Form */}
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: 'background.paper',
              }}
            >
              {error && (
                <MUIAlert 
                  severity="error" 
                  onClose={() => setError(null)}
                  sx={{ mb: 3 }}
                >
                  {error}
                </MUIAlert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <Input
                  label={t('auth.phone')}
                  type="tel"
                  placeholder="+965 XXXX XXXX"
                  {...register('phone', {
                    required: t('validation.required'),
                    validate: (value) => validateKuwaitiPhone(value) || t('validation.phone'),
                  })}
                  error={errors.phone?.message}
                  startIcon={<Icons.Phone />}
                />

                <Input
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: t('validation.required'),
                    minLength: {
                      value: 6,
                      message: t('validation.password'),
                    },
                  })}
                  error={errors.password?.message}
                  startIcon={<Icons.Lock />}
                  endIcon={
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {showPassword ? <Icons.VisibilityOff /> : <Icons.Visibility />}
                    </Box>
                  }
                />

                <Button
                  type="submit"
                  variant="filled"
                  size="large"
                  fullWidth
                  isLoading={isLoading}
                >
                  {t('auth.login')}
                </Button>
              </Box>
            </Paper>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4, spacing: 2 }}>
              <Typography variant="body-2xs" color="on-surface-variant" gutterBottom>
                {t('auth.dontHaveAccount')}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/signup')}
                icon={isRTL ? <Icons.ArrowBack /> : <Icons.ArrowForward />}
                iconPosition="end"
              >
                {t('auth.switchToSignup')}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginMUI; 