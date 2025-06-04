import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Alert, Typography, PhoneInput, LanguageSwitcher, Form, Icon } from '../design_system';
import { authAPI, validateKuwaitiPhone } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useErrorToast } from '../design_system';

interface LoginFormData {
  phone: string;
  password: string;
}

const Login: React.FC = () => {
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>();

  const phoneValue = watch('phone', '');

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
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      {/* Header */}
      <header className="w-full p-6 flex justify-end">
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <Typography variant="display-medium" color="primary">
              {t('auth.login')}
            </Typography>
            <Typography variant="body-medium" color="on-surface-variant">
              {t('auth.welcomeBack')}
            </Typography>
          </div>

          {/* Login Form */}
          <Form variant="elevated" spacing="comfortable">
            {error && (
              <Alert 
                variant="error" 
                message={error}
                dismissible
                onDismiss={() => setError(null)}
              />
            )}

            <div className="space-y-6">
              <PhoneInput
                value={phoneValue}
                onChange={(value) => setValue('phone', value)}
                error={errors.phone?.message}
                required
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
                startIcon={<Icon name="lock" />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <Icon name={showPassword ? 'visibility-off' : 'visibility'} />
                  </button>
                }
              />

              <Button
                type="submit"
                variant="filled"
                size="large"
                fullWidth
                isLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                {t('auth.login')}
              </Button>
            </div>
          </Form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <Typography variant="body-2xs" color="on-surface-variant">
              {t('auth.dontHaveAccount')}
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate('/signup')}
              icon={<Icon name={isRTL ? "arrow-left" : "arrow-right"} />}
              iconPosition="end"
            >
              {t('auth.switchToSignup')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 