import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, Alert, Typography, Icon, LanguageSwitcher, Form } from '../design_system';
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
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center">
        <Button
          variant="text"
          onClick={() => navigate('/login')}
          icon={<Icon name={isRTL ? "arrow-right" : "arrow-left"} />}
          iconPosition="start"
        >
          {t('auth.back')}
        </Button>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Icon name="phone" size="large" className="text-primary-600" />
            </div>
            
            <Typography variant="display-small" color="primary">
              {t('auth.verifyPhone')}
            </Typography>
            
            <div className="space-y-2">
              <Typography variant="body-medium" color="on-surface-variant">
                {t('auth.enterOTP')}
              </Typography>
              <Typography variant="label-large" color="on-surface">
                {phone}
              </Typography>
            </div>
          </div>

          {/* OTP Form */}
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
                label={t('auth.otp')}
                type="text"
                placeholder="000000"
                maxLength={6}
                {...register('code', {
                  required: t('validation.required'),
                  pattern: {
                    value: /^\d{6}$/,
                    message: t('placeholders.otpError'),
                  },
                })}
                error={errors.code?.message}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                helperText={t('placeholders.otpHelper')}
              />

              <Button
                type="submit"
                variant="filled"
                size="large"
                fullWidth
                isLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
                disabled={otpValue.length !== 6}
              >
                {t('auth.verify')}
              </Button>
            </div>
          </Form>

          {/* Resend Section */}
          <div className="text-center space-y-4">
            <Typography variant="body-2xs" color="on-surface-variant">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 