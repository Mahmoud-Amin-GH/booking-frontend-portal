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
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="lg:flex-1 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <h1 className="font-sakr font-bold text-4xl text-white mb-4">
            Welcome to 4Sale
          </h1>
          <p className="font-sakr font-normal text-lg text-primary-100">
            Your trusted marketplace for buying and selling in Kuwait
          </p>
        </div>
      </div>

            {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#092B4C] mb-2">
              {t('auth.signup')}
            </h1>
            <p className="text-lg text-gray-500">
              {t('auth.createAccount')}
            </p>
          </div>

          {/* Error Alert */}
          {serverError && (
            <Alert 
              variant="error" 
              className="mb-6"
            >
              {serverError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <Input
              label={t('auth.displayName')}
              value={form.displayName}
              onChange={handleInputChange('displayName')}
              error={errors.displayName}
              placeholder={t('placeholders.enterFullName')}
              required
            />

            {/* Email */}
            <Input
              label={t('auth.email')}
              type="email"
              value={form.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder={t('placeholders.emailExample')}
              required
            />

            {/* Phone */}
            <Input
              label={t('auth.phone')}
              value={form.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              placeholder="XXXX XXXX"
              startIcon={<span className="text-sm text-gray-500">+965</span>}
              required
            />

            {/* Password */}
            <Input
              label={t('auth.password')}
              type="password"
              value={form.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              placeholder={t('placeholders.minimumPassword')}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="primary"
              size="lg"
              isLoading={loading}
              className="mt-6"
            >
              {loading ? t('common.loading') : t('auth.signup')}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="font-sakr font-normal text-base text-gray-500">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link 
                to="/login-4sale"
                className="text-primary-500 font-semibold hover:text-primary-600 no-underline"
              >
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 