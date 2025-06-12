import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Input, Alert } from '@mo_sami/web-design-system';
import { authAPI, SignupRequest } from '../services/api';
import { 
  validateKuwaitiPhone, 
  handlePhoneInputChange, 
  preparePhoneForAPI 
} from '../business/phoneValidation';

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

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneInputChange(event.target.value, (formatted) => {
      setForm(prev => ({ ...prev, phone: formatted }));
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    });
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
        phone: preparePhoneForAPI(form.phone),
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
              {t('auth.joinCommunity', 'Join Our Community')}
            </h1>
            <p className="font-sakr font-normal text-lg xl:text-xl text-primary-100 mb-6">
              {t('auth.signupSubtitle', 'Start your journey with Kuwait\'s trusted marketplace')}
            </p>
            
            {/* Benefits */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('benefits.freeAccount', 'Free account setup')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('benefits.securePlatform', 'Secure & trusted platform')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="font-sakr font-medium text-primary-100">
                  {t('benefits.instantAccess', 'Instant access to inventory tools')}
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
          <div className="text-center lg:text-left mb-8">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 flex justify-center">
              <div className="bg-primary-50 rounded-xl p-4">
                <img src="/assets/4sale-logo.svg" alt="4Sale" className="h-12 w-auto" />
              </div>
            </div>
            
            <h2 className="font-sakr font-bold text-3xl mb-2 text-on-surface">
              {t('auth.signup')}
            </h2>
            <p className="font-sakr font-normal text-lg text-on-surface-variant">
              {t('auth.createAccountSubtitle', 'Create your account to get started')}
            </p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name */}
              <Input
                label={t('auth.displayName')}
                value={form.displayName}
                onChange={handleInputChange('displayName')}
                error={errors.displayName}
                placeholder={t('placeholders.enterFullName')}
                fullWidth
              />

              {/* Email */}
              <Input
                label={t('auth.email')}
                type="email"
                value={form.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                placeholder={t('placeholders.emailExample')}
                fullWidth
              />

              {/* Phone */}
              <Input
                label={t('auth.phone')}
                type="tel"
                value={form.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder="XXXX XXXX"
                prefix="+965"
                fullWidth
              />

              {/* Password */}
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
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                  disabled={!form.displayName || !form.email || !form.phone || !form.password}
                >
                  {t('auth.signup')}
                </Button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-outline-variant text-center">
              <div className="text-sm">
                <span className="font-sakr text-on-surface-variant">
                  {t('auth.alreadyHaveAccount')}{' '}
                </span>
                <Link 
                  to="/login-4sale"
                  className="font-sakr font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200 no-underline"
                >
                  {t('auth.login')}
                </Link>
              </div>
            </div>
          </div>

          {/* Terms & Privacy */}
          <div className="mt-6 text-center">
            <p className="font-sakr text-xs text-on-surface-variant leading-relaxed">
              {t('auth.termsAgreement', 'By creating an account, you agree to our')}{' '}
              <Link to="/terms" className="text-primary-500 hover:text-primary-600 no-underline">
                {t('legal.terms', 'Terms of Service')}
              </Link>{' '}
              {t('common.and', 'and')}{' '}
              <Link to="/privacy" className="text-primary-500 hover:text-primary-600 no-underline">
                {t('legal.privacy', 'Privacy Policy')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 