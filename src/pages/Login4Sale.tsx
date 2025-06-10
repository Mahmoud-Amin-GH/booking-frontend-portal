import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Typography, Alert } from '../design_system_4sale';
import { authAPI, validateKuwaitiPhone } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../design_system';

interface LoginFormData {
  phone: string;
  password: string;
}

const Login4Sale: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>();

  const phoneValue = watch('phone', '');
  const passwordValue = watch('password', '');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Validate Kuwaiti phone number
      if (!validateKuwaitiPhone(data.phone)) {
        setErrorMessage(t('auth.invalidPhoneNumber'));
        return;
      }

      const response = await authAPI.login({
        phone: data.phone,
        password: data.password,
      });

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(response.message || t('auth.loginFailed'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(t('auth.loginFailed'));
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
          <Typography variant="headline-large" className="text-center mb-4 text-white">
            {t('auth.welcomeBack')}
          </Typography>
          <Typography variant="body-medium" className="text-center text-primary-100">
            {t('auth.loginSubtitle')}
          </Typography>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Language Switcher */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>

          {/* Header */}
          <div>
            <Typography variant="headline-medium" color="on-surface" className="mb-2">
              {t('auth.signIn')}
            </Typography>
            <Typography variant="body-medium" color="on-surface-variant" className="mb-8">
              {t('auth.signInSubtitle')}
            </Typography>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="error" className="mb-6">
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone Input */}
            <Input
              label={t('auth.phoneNumber')}
              type="tel"
              prefix="+965"
              placeholder="12345678"
              error={errors.phone?.message}
              fullWidth
              {...register('phone', {
                required: t('validation.phoneRequired'),
                pattern: {
                  value: /^[1-9]\d{7}$/,
                  message: t('validation.phoneInvalid'),
                },
              })}
            />

            {/* Password Input */}
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.password?.message}
              fullWidth
              {...register('password', {
                required: t('validation.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('validation.passwordMinLength'),
                },
              })}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!phoneValue || !passwordValue}
            >
              {t('auth.signIn')}
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
                {t('auth.signUp')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login4Sale; 