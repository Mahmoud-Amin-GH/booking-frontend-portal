import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from '@mo_sami/web-design-system';
import { authAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  validateKuwaitiPhone, 
  handlePhoneInputChange, 
  preparePhoneForAPI 
} from '../business/phoneValidation';

interface LoginForm {
  phone: string;
  password: string;
}

interface ValidationErrors {
  phone?: string;
  password?: string;
}

const Login4Sale: React.FC = () => {
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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.phone.trim()) {
      newErrors.phone = t('validation.required');
    } else if (!validateKuwaitiPhone('+965 ' + form.phone)) {
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

      const response = await authAPI.login({
        phone: preparePhoneForAPI(form.phone),
        password: form.password,
      });

      // Login successful - OTP sent, navigate to verification
      if (response.message && response.user_id) {
        navigate('/verify-otp', { 
          state: { 
            phone: preparePhoneForAPI(form.phone),
            fromSignup: false 
          }
        });
      } else {
        setErrorMessage(response.message || t('error.loginFailed'));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.error || t('error.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <img src="/assets/4sale-logo.svg" alt="4Sale" className="h-16 w-auto" />
          </div>
          <h1 className="font-sakr font-bold text-3xl text-center mb-4 text-white">
            {t('auth.welcomeBack')}
          </h1>
          <p className="font-sakr font-normal text-base text-center text-primary-100">
            {t('auth.createAccount')}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div>
            <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
              {t('auth.login')}
            </h2>
            <p className="font-sakr font-normal text-base mb-8 text-gray-600">
              {t('auth.welcomeBack')}
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="error" className="mb-6">
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Phone Input */}
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

            {/* Password Input */}
            <Input
              label={t('auth.password')}
              type="password"
              value={form.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              placeholder={t('placeholders.minimumPassword')}
              fullWidth
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!form.phone || !form.password}
            >
              {t('auth.login')}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium font-sakr"
            >
              {t('auth.forgotPassword')}
            </button>

            <div className="text-sm text-on-surface-variant font-sakr">
              {t('auth.dontHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {t('auth.signup')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login4Sale; 