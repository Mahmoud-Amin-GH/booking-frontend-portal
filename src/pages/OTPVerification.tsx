import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Input, Alert, Progress } from '@mo_sami/web-design-system';
import { authAPI, OTPRequest } from '../services/api';
import { maskPhoneNumber } from '../business/phoneValidation';

const OTPVerification: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Get phone number from navigation state
  const phone = location.state?.phone || localStorage.getItem('temp_phone') || '';
  const fromSignup = location.state?.fromSignup || false;

  useEffect(() => {
    if (!phone) {
      // If no phone number, redirect to signup
      navigate('/signup');
      return;
    }

    // Start countdown immediately
    setCanResend(false);
    setCountdown(30);

    const timer = setInterval(() => {
      setCountdown(prev => {
        console.log('Countdown:', prev); // Debug log
        if (prev <= 1) {
          setCanResend(true);
          console.log('Resend now available'); // Debug log
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phone, navigate]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      if (serverError) {
        setServerError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setServerError(t('placeholders.otpError'));
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const otpData: OTPRequest = {
        phone: phone,
        code: otp
      };
      
      const response = await authAPI.verifyOTP(otpData);

      if (response.token) {
        // OTP verification successful
        navigate('/dashboard');
      } else {
        setServerError(t('error.otpFailed'));
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setServerError(error.response?.data?.error || t('error.otpFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setServerError('');

    try {
      // Call resend OTP API - this should trigger actual OTP generation
      // You would replace this with actual API call to resend OTP
      // Example: await authAPI.resendOTP({ phone });
      
      console.log('Resending OTP to:', phone);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset countdown after successful resend
      setCanResend(false);
      setCountdown(30);
      
      // Show success message (optional)
      console.log('OTP resent successfully');
      
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setServerError(error.response?.data?.error || t('error.resendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const maskedPhone = phone ? maskPhoneNumber(phone) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-container-low to-surface-container flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-8">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <img 
                src="/assets/4sale-logo.svg" 
                alt="4Sale" 
                className="h-16 w-auto filter brightness-0 invert" 
              />
            </div>
          </div>
          
          {/* Typography */}
          <div className="text-center max-w-md">
            <h1 className="font-sakr font-bold text-4xl xl:text-5xl mb-4 text-white">
              {t('auth.almostThere', 'Almost There!')}
            </h1>
            <p className="font-sakr font-normal text-lg xl:text-xl text-primary-100 mb-6">
              {t('auth.verificationDescription', 'We\'ve sent a verification code to secure your account')}
            </p>
            
            {/* Security Features */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('security.smsVerification', 'SMS verification')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('security.secureAccess', 'Secure account access')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('security.protectedData', 'Protected personal data')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 flex justify-center">
              <div className="bg-primary-50 rounded-xl p-4">
                <img src="/assets/4sale-logo.svg" alt="4Sale" className="h-12 w-auto" />
              </div>
            </div>
            
            <h2 className="font-sakr font-bold text-3xl mb-2 text-on-surface">
              {t('auth.verifyPhone')}
            </h2>
            <p className="font-sakr font-normal text-lg text-on-surface-variant mb-4">
              {t('auth.otpSentTo', 'We\'ve sent a 6-digit code to')}
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-xl">
              <span className="font-sakr font-bold text-lg text-primary-700">
                {maskedPhone}
              </span>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
            {/* Error Alert */}
            {serverError && (
              <div className="mb-4">
                <Alert variant="error">
                  {serverError}
                </Alert>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="text-center">
                <label className="font-sakr font-medium text-lg text-on-surface mb-3 block">
                  {t('auth.enterCode', 'Enter verification code')}
                </label>
                <Input
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  fullWidth
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                />
                <p className="font-sakr text-sm text-on-surface-variant mt-2">
                  {t('auth.codeLength', 'Enter the 6-digit code sent to your phone')}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                disabled={otp.length !== 6}
              >
                {t('auth.verify')}
              </Button>
            </form>

            {/* Resend Section */}
            <div className="mt-6 pt-4 border-t border-outline-variant">
              <div className="text-center space-y-3">
                <p className="font-sakr text-sm text-on-surface-variant">
                  {t('auth.didntReceiveCode')}
                </p>
                
                {canResend ? (
                  <Button
                    onClick={handleResendOTP}
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                    className="text-primary-500 hover:text-primary-600"
                  >
                    {t('auth.resendCode', 'Resend Code')}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-4 h-4">
                      <Progress 
                        variant="default" 
                        value={((30 - countdown) / 30) * 100}
                        className="w-full h-1"
                      />
                    </div>
                    <span className="font-sakr text-sm text-on-surface-variant">
                      {t('auth.resendIn', 'Resend in')} {countdown}s
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={handleBackToLogin}
              className="text-on-surface-variant hover:text-on-surface"
            >
              ← {t('auth.backToLogin', 'Back to Login')}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="font-sakr text-xs text-on-surface-variant">
              {t('auth.troubleReceiving', 'Having trouble receiving the code?')}{' '}
              <button 
                type="button"
                className="text-primary-500 hover:text-primary-600 no-underline"
                onClick={() => {/* Handle help */}}
              >
                {t('auth.contactSupport', 'Contact Support')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 