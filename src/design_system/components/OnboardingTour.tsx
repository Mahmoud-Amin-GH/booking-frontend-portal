import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper } from '@mui/material';
import { Typography, Button, Icon } from '../index';
import { useLanguage } from '../../contexts/LanguageContext';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isVisible, onComplete, onSkip }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'sidebar',
      title: t('onboarding.step1Title'),
      content: t('onboarding.step1Content'),
      target: '[data-tour="sidebar"]',
      position: 'right'
    },
    {
      id: 'inventory',
      title: t('onboarding.step2Title'),
      content: t('onboarding.step2Content'),
      target: '[data-tour="inventory-nav"]',
      position: 'right'
    },
    {
      id: 'search',
      title: t('onboarding.step3Title'),
      content: t('onboarding.step3Content'),
      target: '[data-tour="search"]',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    if (isVisible) {
      setOverlayVisible(true);
      // Scroll to top when tour starts
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setOverlayVisible(false);
      setCurrentStep(0);
    }
  }, [isVisible]);

  const getCurrentStepElement = () => {
    const step = steps[currentStep];
    if (!step) return null;
    return document.querySelector(step.target);
  };

  const getHighlightPosition = () => {
    const element = getCurrentStepElement();
    if (!element) return { top: 0, left: 0, width: 0, height: 0 };
    
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  };

  const getTooltipPosition = () => {
    const element = getCurrentStepElement();
    const step = steps[currentStep];
    if (!element || !step) return { top: 0, left: 0 };
    
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 20;
    
    let top = rect.top + window.scrollY;
    let left = rect.left + window.scrollX;
    
    switch (step.position) {
      case 'right':
        left = rect.right + offset;
        top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
        break;
      case 'left':
        left = rect.left - tooltipWidth - offset;
        top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + offset;
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'top':
        top = rect.top + window.scrollY - tooltipHeight - offset;
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
        break;
    }
    
    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 10) left = 10;
    if (left + tooltipWidth > viewportWidth - 10) left = viewportWidth - tooltipWidth - 10;
    if (top < 10) top = 10;
    if (top + tooltipHeight > window.scrollY + viewportHeight - 10) {
      top = window.scrollY + viewportHeight - tooltipHeight - 10;
    }
    
    return { top, left };
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setOverlayVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setOverlayVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible) return null;

  const highlightPos = getHighlightPosition();
  const tooltipPos = getTooltipPosition();
  const currentStepData = steps[currentStep];

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      {/* Dark Overlay */}
      <Box
        onClick={handleSkip}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: overlayVisible ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      {/* Spotlight Highlight */}
      {currentStepData && (
        <Box
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            top: highlightPos.top - 8,
            left: highlightPos.left - 8,
            width: highlightPos.width + 16,
            height: highlightPos.height + 16,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: 1.5,
            transition: 'all 0.3s ease-in-out',
          }}
        />
      )}
      
      {/* Tooltip */}
      {currentStepData && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: 320,
            p: 3,
            borderRadius: 2,
            opacity: overlayVisible ? 1 : 0,
            transform: overlayVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  backgroundColor: 'primary.50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="label-small" color="primary" sx={{ fontWeight: 'bold' }}>
                  {currentStep + 1}
                </Typography>
              </Box>
              <Typography variant="body-small" color="on-surface-variant">
                {currentStep + 1} of {steps.length}
              </Typography>
            </Box>
            <Button variant="text" size="small" onClick={handleSkip}>
              <Icon name="phone" size="small" />
            </Button>
          </Box>
          
          {/* Content */}
          <Box sx={{ mb: 3, textAlign: isRTL ? 'right' : 'left' }}>
            <Typography variant="title-medium" color="on-surface" sx={{ fontWeight: 'bold', mb: 1 }}>
              {currentStepData.title}
            </Typography>
            <Typography variant="body-medium" color="on-surface-variant">
              {currentStepData.content}
            </Typography>
          </Box>
          
          {/* Actions */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
          >
            <Button variant="text" onClick={handleSkip}>
              {t('onboarding.skip')}
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              {currentStep > 0 && (
                <Button variant="outlined" size="small" onClick={prevStep}>
                  {t('common.previous')}
                </Button>
              )}
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
              </Button>
            </Box>
          </Box>
          
          {/* Progress Indicators */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            {steps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 
                    index === currentStep ? 'primary.main' : 
                    index < currentStep ? 'primary.300' : 'divider',
                  transition: 'background-color 0.2s ease-in-out',
                }}
              />
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Welcome Modal for First Step */}
      {currentStep === 0 && (
        <Box 
          sx={{ 
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Paper
            elevation={12}
            sx={{
              p: 4,
              maxWidth: 448,
              width: '100%',
              mx: 'auto',
              borderRadius: 2,
              opacity: overlayVisible ? 1 : 0,
              transform: overlayVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Box sx={{ textAlign: isRTL ? 'right' : 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  width: 64,
                  height: 64,
                  backgroundColor: 'primary.50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Icon name="check" size="large" sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="headline-small" color="on-surface" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('onboarding.welcome')}
              </Typography>
              <Typography variant="body-medium" color="on-surface-variant">
                Let's take a quick tour to help you get started with managing your car rental inventory.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <Button variant="text" onClick={handleSkip} sx={{ flex: 1 }}>
                {t('onboarding.skip')}
              </Button>
              <Button onClick={nextStep} sx={{ flex: 1 }}>
                Start Tour
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default OnboardingTour; 