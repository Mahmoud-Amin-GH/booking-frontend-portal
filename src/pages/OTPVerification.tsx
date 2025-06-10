import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Button,
  Input,
  Alert,
  Typography,
  Progress,
  Card
} from '../design_system_4sale';
import { authAPI, OTPRequest } from '../services/api';

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
    navigate('/login-4sale');
  };

  const maskedPhone = phone ? phone.replace(/(\+965\s\d{2})\d{2}(\s\d{4})/, '$1**$2') : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="lg:flex-1 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <Typography variant="display-medium" className="text-white mb-4">
            Welcome to 4Sale
          </Typography>
          <Typography variant="body-large" className="text-primary-100">
            Your trusted marketplace for buying and selling in Kuwait
          </Typography>
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md" padding="xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <Typography 
              variant="headline-large" 
              className="text-[#092B4C] mb-2"
            >
              {t('auth.verifyPhone')}
            </Typography>
            <Typography 
              variant="body-large"
              className="text-gray-500 mb-4"
            >
              {t('placeholders.otpHelper')}
            </Typography>
            <Typography 
              variant="body-medium"
              className="text-[#092B4C] font-semibold"
            >
              {maskedPhone}
            </Typography>
          </div>

          {/* Error Alert */}
          {serverError && (
            <Alert 
              variant="error" 
              message={serverError}
              className="mb-6"
              dismissible
              onDismiss={() => setServerError('')}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <Typography 
                variant="label-large"
                className={`text-gray-700 mb-2 block font-semibold ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {t('auth.otp')}
              </Typography>
              <Input
                fullWidth
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="primary"
              size="lg"
              isLoading={loading}
              disabled={otp.length !== 6}
              className="mb-6"
            >
              {loading ? t('common.loading') : t('auth.verify')}
            </Button>

            {/* Resend OTP */}
            <div className="text-center mb-6">
              <Typography 
                variant="body-medium"
                className="text-gray-500 mb-2"
              >
                {t('auth.didntReceiveCode')}
              </Typography>
              
                          {canResend ? (
              <Button
                onClick={handleResendOTP}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="text-primary-500 hover:text-primary-600"
              >
                {loading ? 'Sending...' : t('auth.resendOTP')}
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Progress 
                  variant="circular" 
                  size="sm" 
                  value={((30 - countdown) / 30) * 100}
                  color="primary"
                />
                <Typography 
                  variant="body-small"
                  className="text-gray-400"
                >
                  Resend available in {countdown}s
                </Typography>
              </div>
            )}
            </div>

            {/* Back Button */}
            <Button
              fullWidth
              variant="outline"
              onClick={handleBackToLogin}
              size="lg"
            >
              {t('auth.back')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification; 