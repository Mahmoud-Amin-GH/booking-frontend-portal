import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Button,
  Input,
  Alert, 
  Typography,
  Card
} from '../design_system_4sale';
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
    } else if (!validateKuwaitiPhone(form.phone)) {
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
          <div className="mb-8">
            <Typography 
              variant="headline-large" 
              className="text-[#092B4C] mb-2"
            >
              {t('auth.signup')}
            </Typography>
            <Typography 
              variant="body-large"
              className="text-gray-500"
            >
              {t('auth.createAccount')}
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
            {/* Display Name */}
            <div>
              <Typography 
                variant="label-large"
                className="text-gray-700 mb-2 block font-semibold"
              >
                {t('auth.displayName')}
              </Typography>
              <Input
                fullWidth
                value={form.displayName}
                onChange={handleInputChange('displayName')}
                error={errors.displayName}
                placeholder={t('placeholders.enterFullName')}
              />
            </div>

            {/* Email */}
            <div>
              <Typography 
                variant="label-large"
                className="text-gray-700 mb-2 block font-semibold"
              >
                {t('auth.email')}
              </Typography>
              <Input
                fullWidth
                type="email"
                value={form.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                placeholder={t('placeholders.emailExample')}
              />
            </div>

            {/* Phone */}
            <div>
              <Typography 
                variant="label-large"
                className="text-gray-700 mb-2 block font-semibold"
              >
                {t('auth.phone')}
              </Typography>
              <Input
                fullWidth
                value={form.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder="XXXX XXXX"
                prefix="+965"
              />
            </div>

            {/* Password */}
            <div>
              <Typography 
                variant="label-large"
                className="text-gray-700 mb-2 block font-semibold"
              >
                {t('auth.password')}
              </Typography>
              <Input
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                placeholder={t('placeholders.minimumPassword')}
                suffix={
                  <img
                    src="/assets/eye-icon.svg"
                    alt={showPassword ? "Hide password" : "Show password"}
                    onClick={togglePasswordVisibility}
                    className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100"
                    style={{ opacity: showPassword ? 1 : 0.6 }}
                  />
                }
              />
            </div>

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
            <Typography 
              variant="body-medium"
              className="text-gray-500"
            >
              {t('auth.alreadyHaveAccount')}{' '}
                          <Link 
              to="/login-4sale"
              className="text-primary-500 font-semibold hover:text-primary-600 no-underline"
            >
              {t('auth.login')}
            </Link>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup; 