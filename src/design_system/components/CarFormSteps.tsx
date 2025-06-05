import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Alert, Stack } from '@mui/material';
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      {steps.map((step, index) => (
        <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 2,
                borderColor: index <= currentStep ? 'primary.main' : 'divider',
                backgroundColor: index <= currentStep ? 'primary.main' : 'background.paper',
                color: index <= currentStep ? 'primary.contrastText' : 'text.secondary',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {index < currentStep ? (
                <Icon name="check" size="small" />
              ) : (
                <Icon name={step.icon} size="small" />
              )}
            </Box>
            <Box sx={{ textAlign: isRTL ? 'right' : 'center', mt: 1 }}>
              <Typography 
                variant="label-small" 
                color={index <= currentStep ? 'primary' : 'on-surface-variant'}
                sx={{ fontWeight: 'medium' }}
              >
                {step.title}
              </Typography>
            </Box>
          </Box>
          {index < steps.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: 2,
                mx: 2,
                backgroundColor: index < currentStep ? 'primary.main' : 'divider',
                transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );

  // Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <Stack spacing={3}>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3
              }}
            >
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
            </Box>
          </Stack>
        );

      case 1: // Specifications
        return (
          <Stack spacing={3}>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3
              }}
            >
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
            </Box>
          </Stack>
        );

      case 2: // Availability & Pricing
        return (
          <Stack spacing={3}>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3
              }}
            >
              <NumberInput
                label={t('cars.availableCount')}
                value={formData.available_count}
                onChange={(value) => updateFormData({ available_count: Number(value) || 0 })}
                min={0}
                required
                helperText="Number of vehicles available for rent"
              />

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'grey.50',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="label-medium" color="on-surface" sx={{ mb: 1 }}>
                  Pricing Configuration
                </Typography>
                <Typography variant="body-small" color="on-surface-variant">
                  Pricing options will be available in a future update. For now, focus on inventory management.
                </Typography>
              </Paper>
            </Box>

            {/* Summary Card */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                backgroundColor: 'primary.50',
                border: 1,
                borderColor: 'primary.200',
                borderRadius: 2,
              }}
            >
              <Typography variant="title-small" color="primary" sx={{ mb: 2, fontWeight: 'medium' }}>
                Vehicle Summary
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2
                }}
              >
                <Box>
                  <Typography variant="body-small" color="on-surface-variant">Brand & Model</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {brandOptions.find(b => b.value === formData.brand_id)?.label || '—'} {' '}
                    {modelOptions.find(m => m.value === formData.model_id)?.label || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body-small" color="on-surface-variant">Year & Seats</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {formData.year || '—'} • {formData.seats || '—'} seats
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body-small" color="on-surface-variant">Color & Type</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {colorOptions.find(c => c.value === formData.color_id)?.label || '—'} • {' '}
                    {carTypeOptions.find(ct => ct.value === formData.car_type)?.label || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body-small" color="on-surface-variant">Transmission</Typography>
                  <Typography variant="body-medium" color="on-surface">
                    {transmissionOptions.find(t => t.value === formData.transmission)?.label || '—'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Stack spacing={4}>
      {/* Form Errors */}
      {formErrors.length > 0 && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="body-small" sx={{ fontWeight: 'medium', mb: 1 }}>
            Please fix the following errors:
          </Typography>
          <Box component="ul" sx={{ listStyle: 'disc', listStylePosition: 'inside', m: 0, pl: 0 }}>
            {formErrors.map((error, index) => (
              <Box component="li" key={index} sx={{ fontSize: 'small' }}>
                {error}
              </Box>
            ))}
          </Box>
        </Alert>
      )}

      {/* Step Progress */}
      <StepProgress />

      {/* Step Header */}
      <Box sx={{ textAlign: isRTL ? 'right' : 'center', mb: 4 }}>
        <Typography variant="headline-small" color="on-surface" sx={{ fontWeight: 'bold', mb: 1 }}>
          {steps[currentStep].title}
        </Typography>
        <Typography variant="body-medium" color="on-surface-variant">
          {t('form.step', { current: currentStep + 1, total: steps.length })} • {steps[currentStep].description}
        </Typography>
      </Box>

      {/* Step Content */}
      <Box sx={{ minHeight: 300 }}>
        {renderStepContent()}
      </Box>

      {/* Navigation */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <Box>
          {currentStep > 0 && (
            <Button variant="outlined" onClick={prevStep}>
              <Icon name="arrow-left" size="small" sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
              {t('common.previous')}
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
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
              <Icon name="arrow-right" size="small" sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
            </Button>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default CarFormSteps; 