import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from '@mo_sami/web-design-system';
import { authAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  handlePhoneInputChange, 
} from '../business/phoneValidation';

interface LoginForm {
  phone: string;
  password: string;
}

interface ValidationErrors {
  phone?: string;
  password?: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  
  const [form, setForm] = useState<LoginForm>({
    phone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Simplified validation: check if phone number has at least 8 digits
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      newErrors.phone = t('validation.phone', 'Please enter a valid phone number.');
    }

    if (!form.password) {
      newErrors.password = t('validation.required');
    } else if (form.password.length < 6) {
      newErrors.password = t('validation.password', 'Password must be at least 6 characters.');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginForm) => (
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

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneInputChange(event.target.value, (formatted) => {
      setForm(prev => ({ ...prev, phone: formatted }));
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // The phone number sent to the API should be in the format "965..."
      const apiPhone = `965${form.phone.replace(/\s/g, '')}`;

      const response = await authAPI.login({
        phone: apiPhone,
        password: form.password,
      });
      
      // With the remote API, a successful login always returns a token.
      if (response.token) {
        setSuccessMessage(t('auth.loginSuccess', 'Login successful! Redirecting...'));
        
        // The token is already set in localStorage by api.ts
        
        // Brief delay to show success message before navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // This case should ideally not be reached if the API call is successful
        setErrorMessage(response.message || t('error.loginFailed', 'An unexpected error occurred.'));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const apiError = error.response?.data?.message || error.response?.data?.error || t('error.loginFailed', 'Invalid credentials or server error.');
      setErrorMessage(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-container-low to-surface-container flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section (no changes here) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-8">
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <img 
                src="/assets/4sale-logo.svg" 
                alt="4Sale" 
                className="h-16 w-auto filter brightness-0 invert" 
              />
            </div>
          </div>
          <div className="text-center max-w-md">
            <h1 className="font-sakr font-bold text-4xl xl:text-5xl mb-4 text-white">
              {t('auth.welcomeBack')}
            </h1>
            <p className="font-sakr font-normal text-lg xl:text-xl text-primary-100 mb-6">
              {t('auth.createAccount')}
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('features.manageInventory', 'Manage your car inventory')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('features.trackBookings', 'Track bookings in real-time')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('features.analytics', 'Advanced analytics & reports')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-sakr font-bold text-3xl mb-2 text-on-surface">
              {t('auth.login')}
            </h2>
          </div>

          <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
            {successMessage && (
              <div className="mb-4">
                <Alert variant="success">
                  {successMessage}
                </Alert>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4">
                <Alert variant="error">
                  {errorMessage}
                </Alert>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label={t('auth.phone')}
                type="tel"
                value={form.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder="XXXX XXXX"
                fullWidth
                prefix="+965"
              />

              <Input
                label={t('auth.password')}
                type="password"
                value={form.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                placeholder={t('placeholders.minimumPassword')}
                fullWidth
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!form.phone || !form.password || isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
