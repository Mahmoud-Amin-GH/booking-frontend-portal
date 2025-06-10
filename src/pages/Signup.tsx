import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { Box, Stack, TextField, Button as MUIButton } from '@mui/material';
import {
  Alert, 
  Typography, 
  PhoneInput
} from '../design_system';
import { AuthLayout } from '../design_system/components/AuthLayout';
import { HeroSection } from '../design_system/components/HeroSection';
import { authAPI, SignupRequest } from '../services/api';

interface SignupForm {
  displayName: string;
  email: string;
  phone: string;
  password: string;
}

interface ValidationErrors {
  displayName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<SignupForm>({
    displayName: '',
    email: '',
    phone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.displayName.trim()) {
      newErrors.displayName = t('validation.required');
    }

    if (!form.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('validation.email');
    }

    if (!form.phone.trim()) {
      newErrors.phone = t('validation.required');
    } else if (!/^\+965\s\d{4}\s\d{4}$/.test(form.phone)) {
      newErrors.phone = t('validation.phone');
    }

    if (!form.password) {
      newErrors.password = t('validation.required');
    } else if (form.password.length < 6) {
      newErrors.password = t('validation.password');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SignupForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handlePhoneChange = (phone: string) => {
    setForm(prev => ({ ...prev, phone }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      // Call the signup API
      const signupData: SignupRequest = {
        display_name: form.displayName,
        email: form.email,
        phone: form.phone,
        password: form.password
      };
      
      await authAPI.signup(signupData);

      // Navigate to OTP verification with the phone number
      navigate('/verify-otp', { 
        state: { 
          phone: form.phone,
          fromSignup: true 
        }
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      setServerError(error.response?.data?.error || t('error.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        <Box sx={{ marginBottom: '32px', textAlign: isRTL ? 'right' : 'left' }}>
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
            {t('auth.signup')}
          </Typography>
          <Typography 
            variant="body-large"
            sx={{ 
              fontFamily: 'SS Sakr Soft',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#6B7280'
            }}
          >
            {t('auth.createAccount')}
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
          <Stack spacing={3}>
            {/* Display Name */}
            <Box>
              <Typography 
                variant="label-large"
                sx={{ 
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block'
                }}
              >
                {t('auth.displayName')}
              </Typography>
              <TextField
                fullWidth
                value={form.displayName}
                onChange={handleInputChange('displayName')}
                error={!!errors.displayName}
                helperText={errors.displayName}
                placeholder={t('placeholders.enterFullName')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'SS Sakr Soft',
                    fontSize: '16px',
                    backgroundColor: '#FFFFFF',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1D8EFF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1D8EFF',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Box>

            {/* Email */}
            <Box>
              <Typography 
                variant="label-large"
                sx={{ 
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block'
                }}
              >
                {t('auth.email')}
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={form.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                placeholder={t('placeholders.emailExample')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'SS Sakr Soft',
                    fontSize: '16px',
                    backgroundColor: '#FFFFFF',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1D8EFF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1D8EFF',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Box>

            {/* Phone */}
            <Box>
              <Typography 
                variant="label-large"
                sx={{ 
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block'
                }}
              >
                {t('auth.phone')}
              </Typography>
              <PhoneInput
                value={form.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography 
                variant="label-large"
                sx={{ 
                  fontFamily: 'SS Sakr Soft',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'block'
                }}
              >
                {t('auth.password')}
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                placeholder={t('placeholders.minimumPassword')}
                InputProps={{
                  endAdornment: (
                    <Box
                      component="img"
                      src="/assets/eye-icon.svg"
                      alt={showPassword ? "Hide password" : "Show password"}
                      onClick={togglePasswordVisibility}
                      sx={{
                        width: 20,
                        height: 20,
                        cursor: 'pointer',
                        opacity: showPassword ? 1 : 0.6,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'SS Sakr Soft',
                    fontSize: '16px',
                    backgroundColor: '#FFFFFF',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1D8EFF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1D8EFF',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <MUIButton
              type="submit"
              fullWidth
              disabled={loading}
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
                marginTop: '24px',
                '&:hover': {
                  backgroundColor: '#1570CD',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              {loading ? t('common.loading') : t('auth.signup')}
            </MUIButton>
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            marginTop: '32px',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="body-medium"
            sx={{ 
              fontFamily: 'SS Sakr Soft',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#6B7280'
            }}
          >
            {t('auth.alreadyHaveAccount')}{' '}
            <Link 
              to="/login"
              style={{
                color: '#1D8EFF',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('auth.login')}
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Signup; 