import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Alert, Typography, Form, Icon } from '../design_system';
import PhoneInput from '../components/PhoneInput';
import LanguageSwitcher from '../components/LanguageSwitcher';
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const phoneValue = watch('phone', '');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate phone number format
      if (!validateKuwaitiPhone(data.phone)) {
        setError(t('validation.phone'));
        setIsLoading(false);
        return;
      }

      const response = await authAPI.signup(data);
      
      // Store user ID for OTP verification
      localStorage.setItem('temp_user_id', response.user_id?.toString() || '');
      localStorage.setItem('temp_phone', data.phone);
      
      // Navigate to OTP verification
      navigate('/verify-otp');
    } catch (err: any) {
      setError(err.response?.data?.error || t('error.signupFailed'));
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
              {t('auth.signup')}
            </Typography>
            <Typography variant="body-medium" color="on-surface-variant">
              {t('auth.createAccount')}
            </Typography>
          </div>

          {/* Signup Form */}
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
              <Input
                label={t('auth.displayName')}
                {...register('display_name', {
                  required: t('validation.required'),
                })}
                error={errors.display_name?.message}
                startIcon={<Icon name="user" />}
                placeholder={t('placeholders.enterFullName')}
              />

              <Input
                label={t('auth.email')}
                type="email"
                {...register('email', {
                  required: t('validation.required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('validation.email'),
                  },
                })}
                error={errors.email?.message}
                startIcon={<Icon name="email" />}
                placeholder={t('placeholders.emailExample')}
              />

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
                placeholder={t('placeholders.minimumPassword')}
              />

              <Button
                type="submit"
                variant="filled"
                size="large"
                fullWidth
                isLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                {t('auth.signup')}
              </Button>
            </div>
          </Form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <Typography variant="body-2xs" color="on-surface-variant">
              {t('auth.alreadyHaveAccount')}
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              icon={<Icon name="arrow-left" />}
              iconPosition="end"
            >
              {t('auth.switchToLogin')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 