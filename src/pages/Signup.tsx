import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, TextField, Button as MUIButton } from '@mui/material';
import { 
  Input, 
  Button, 
  Alert, 
  Typography, 
  PhoneInput, 
  AuthLayout, 
  HeroSection 
} from '../design_system';
import { authAPI, validateKuwaitiPhone } from '../services/api';

interface SignupFormData {
  display_name: string;
  email: string;
  phone: string;
  password: string;
}

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.display_name.trim()) {
      newErrors.display_name = t('validation.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = t('validation.email');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    } else if (!validateKuwaitiPhone(formData.phone)) {
      newErrors.phone = t('validation.phone');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('validation.required');
    } else if (formData.password.length < 8) {
      newErrors.password = 'At least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.signup(formData);
      
      // Check if we got a token (development mode)
      if (response.token) {
        navigate('/dashboard');
      } else {
        localStorage.setItem('temp_user_id', response.user_id?.toString() || '');
        localStorage.setItem('temp_phone', formData.phone);
        navigate('/verify-otp');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t('error.signupFailed'));
    } finally {
      setIsLoading(false);
    }
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
            Sign Up
          </Typography>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: 1.5,
              color: '#505F79',
            }}
          >
            By signing up you get full access to all of our features, Hurry up!
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
            {/* Phone Input */}
            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="xxxxxxxx"
            />

            {/* Name Input */}
            <TextField
              fullWidth
              placeholder="Name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              error={Boolean(errors.display_name)}
              helperText={errors.display_name}
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
                  padding: '12px 16px',
                  fontFamily: 'SS Sakr Soft',
                  fontSize: '16px',
                  '&::placeholder': {
                    color: '#A8AFBB',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Email Input */}
            <TextField
              fullWidth
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
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
                  padding: '12px 16px',
                  fontFamily: 'SS Sakr Soft',
                  fontSize: '16px',
                  '&::placeholder': {
                    color: '#A8AFBB',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password || 'At least 8 characters.'}
              InputProps={{
                endAdornment: (
                  <MUIButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ 
                      minWidth: 'auto',
                      p: 1,
                      color: '#59688E',
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/eye-icon.svg"
                      alt={showPassword ? "Hide password" : "Show password"}
                      sx={{
                        width: 24,
                        height: 24,
                        filter: 'none',
                      }}
                    />
                  </MUIButton>
                ),
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
                  padding: '12px 16px',
                  fontFamily: 'SS Sakr Soft',
                  fontSize: '16px',
                  '&::placeholder': {
                    color: '#A8AFBB',
                    opacity: 1,
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontFamily: 'SS Sakr Soft',
                  fontSize: '14px',
                  color: '#6B788E',
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
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </MUIButton>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '14px',
              color: '#092B4C',
            }}
          >
            Already have an account?
          </Typography>
          <MUIButton
            onClick={() => navigate('/login')}
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
            }}
          >
            Log In
          </MUIButton>
        </Box>

        {/* Terms & Conditions */}
        <Box sx={{ textAlign: 'center', padding: '0 16px' }}>
          <Typography
            sx={{
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '12px',
              color: '#324575',
              marginBottom: 0.5,
            }}
          >
            By using the 4Sale app, you agree to our
          </Typography>
          <MUIButton
            sx={{
              color: '#0062FF',
              fontFamily: 'SS Sakr Soft',
              fontWeight: 500,
              fontSize: '12px',
              textTransform: 'none',
              padding: 0,
              minWidth: 'auto',
              textDecoration: 'underline',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            Terms & conditions
          </MUIButton>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Signup; 