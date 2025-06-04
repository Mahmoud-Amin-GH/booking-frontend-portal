import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Icon, Input, Select, NumberInput, SelectOption } from '../index';
import { useLanguage } from '../../contexts/LanguageContext';
import { CarFormData } from '../../services/carApi';

interface CarFormStepsProps {
  formData: Partial<CarFormData>;
  onFormDataChange: (data: Partial<CarFormData>) => void;
  brandOptions: SelectOption[];
  modelOptions: SelectOption[];
  colorOptions: SelectOption[];
  transmissionOptions: SelectOption[];
  carTypeOptions: SelectOption[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  formErrors: string[];
}

const CarFormSteps: React.FC<CarFormStepsProps> = ({
  formData,
  onFormDataChange,
  brandOptions,
  modelOptions,
  colorOptions,
  transmissionOptions,
  carTypeOptions,
  onSubmit,
  onCancel,
  isSubmitting,
  formErrors
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'basic',
      title: t('form.basicInfo'),
      description: 'Brand, model, and year information',
      icon: 'user' as const,
    },
    {
      id: 'specifications',
      title: t('form.specifications'),
      description: 'Technical details and features',
      icon: 'check' as const,
    },
    {
      id: 'availability',
      title: t('form.availability'),
      description: 'Stock and pricing information',
      icon: 'phone' as const,
    },
  ];

  const updateFormData = (updates: Partial<CarFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!(formData.brand_id && formData.model_id && formData.year);
      case 1: // Specifications
        return !!(formData.seats && formData.color_id && formData.transmission && formData.car_type);
      case 2: // Availability
        return !!(formData.available_count !== undefined && formData.available_count >= 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = validateCurrentStep();
  const isLastStep = currentStep === steps.length - 1;

  // Step Progress Indicator
  const StepProgress = () => (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${index <= currentStep 
                ? 'bg-primary border-primary text-white' 
                : 'bg-surface border-outline-variant text-on-surface-variant'
              }
            `}>
              {index < currentStep ? (
                <Icon name="check" size="small" />
              ) : (
                <Icon name={step.icon} size="small" />
              )}
            </div>
            <div className={`text-center mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Typography 
                variant="label-small" 
                color={index <= currentStep ? 'primary' : 'on-surface-variant'}
                className="font-medium"
              >
                {step.title}
              </Typography>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              flex-1 h-0.5 mx-4 transition-all duration-300
              ${index < currentStep ? 'bg-primary' : 'bg-outline-variant'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  // Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label={t('cars.brand')}
                options={brandOptions}
                value={formData.brand_id}
                onChange={(value) => updateFormData({ brand_id: Number(value), model_id: 0 })}
                required
              />

              <Select
                label={t('cars.model')}
                options={modelOptions}
                value={formData.model_id}
                onChange={(value) => updateFormData({ model_id: Number(value) })}
                disabled={!formData.brand_id || modelOptions.length === 0}
                placeholder={!formData.brand_id ? t('form.selectBrandFirst') : t('common.select')}
                required
              />

              <NumberInput
                label={t('cars.year')}
                value={formData.year}
                onChange={(value) => updateFormData({ year: Number(value) || 0 })}
                min={1900}
                max={2030}
                required
              />

              <Input
                label={t('cars.trimLevel')}
                value={formData.trim_level}
                onChange={(e) => updateFormData({ trim_level: e.target.value })}
                placeholder={t('cars.trimLevelPlaceholder')}
              />
            </div>
          </div>
        );

      case 1: // Specifications
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberInput
                label={t('cars.seats')}
                value={formData.seats}
                onChange={(value) => updateFormData({ seats: Number(value) || 0 })}
                min={1}
                max={12}
                required
              />

              <Select
                label={t('cars.color')}
                options={colorOptions}
                value={formData.color_id}
                onChange={(value) => updateFormData({ color_id: Number(value) })}
                required
              />

              <Select
                label={t('cars.transmission')}
                options={transmissionOptions}
                value={formData.transmission}
                onChange={(value) => updateFormData({ transmission: value as any })}
                required
              />

              <Select
                label={t('cars.carType')}
                options={carTypeOptions}
                value={formData.car_type}
                onChange={(value) => updateFormData({ car_type: value as any })}
                required
              />
            </div>
          </div>
        );

      case 2: // Availability & Pricing
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberInput
                label={t('cars.availableCount')}
                value={formData.available_count}
                onChange={(value) => updateFormData({ available_count: Number(value) || 0 })}
                min={0}
                required
                helperText="Number of vehicles available for rent"
              />

              <div className="bg-surface-container-low rounded-lg p-4">
                <Typography variant="label-medium" color="on-surface" className="mb-2">
                  Pricing Configuration
                </Typography>
                <Typography variant="body-small" color="on-surface-variant">
                  Pricing options will be available in a future update. For now, focus on inventory management.
                </Typography>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <Typography variant="title-small" color="primary" className="mb-4 font-medium">
                Vehicle Summary
              </Typography>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Typography variant="body-small" color="on-surface-variant">Brand & Model</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {brandOptions.find(b => b.value === formData.brand_id)?.label || '—'} {' '}
                    {modelOptions.find(m => m.value === formData.model_id)?.label || '—'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body-small" color="on-surface-variant">Year & Seats</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {formData.year || '—'} • {formData.seats || '—'} seats
                  </Typography>
                </div>
                <div>
                  <Typography variant="body-small" color="on-surface-variant">Color & Type</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {colorOptions.find(c => c.value === formData.color_id)?.label || '—'} • {' '}
                    {carTypeOptions.find(ct => ct.value === formData.car_type)?.label || '—'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body-small" color="on-surface-variant">Transmission</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {transmissionOptions.find(t => t.value === formData.transmission)?.label || '—'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Errors */}
      {formErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <Typography variant="body-small" className="font-medium mb-2">Please fix the following errors:</Typography>
          <ul className="list-disc list-inside space-y-1">
            {formErrors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Progress */}
      <StepProgress />

      {/* Step Header */}
      <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="headline-small" color="on-surface" className="font-bold mb-2">
          {steps[currentStep].title}
        </Typography>
        <Typography variant="body-medium" color="on-surface-variant">
          {t('form.step', { current: currentStep + 1, total: steps.length })} • {steps[currentStep].description}
        </Typography>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          {currentStep > 0 && (
            <Button variant="outlined" onClick={prevStep}>
              <Icon name="arrow-left" size="small" className={isRTL ? 'rotate-180' : ''} />
              {t('common.previous')}
            </Button>
          )}
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="text" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          
          {isLastStep ? (
            <Button 
              onClick={onSubmit}
              disabled={isSubmitting || !canProceed}
            >
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!canProceed}
            >
              {t('common.next')}
              <Icon name="arrow-right" size="small" className={isRTL ? 'rotate-180' : ''} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarFormSteps; 