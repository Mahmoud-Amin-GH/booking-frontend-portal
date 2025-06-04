import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    <div className="fixed inset-0 z-50">
      {/* Dark Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          overlayVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleSkip}
      />
      
      {/* Spotlight Highlight */}
      {currentStepData && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: highlightPos.top - 8,
            left: highlightPos.left - 8,
            width: highlightPos.width + 16,
            height: highlightPos.height + 16,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      )}
      
      {/* Tooltip */}
      {currentStepData && (
        <div
          className={`absolute bg-surface border border-outline-variant rounded-lg shadow-xl p-6 w-80 transition-all duration-300 ${
            overlayVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
          }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Typography variant="label-small" color="primary" className="font-bold">
                  {currentStep + 1}
                </Typography>
              </div>
              <Typography variant="body-small" color="on-surface-variant">
                {currentStep + 1} of {steps.length}
              </Typography>
            </div>
            <Button variant="text" size="small" onClick={handleSkip}>
              <Icon name="phone" size="small" />
            </Button>
          </div>
          
          {/* Content */}
          <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Typography variant="title-medium" color="on-surface" className="font-bold mb-2">
              {currentStepData.title}
            </Typography>
            <Typography variant="body-medium" color="on-surface-variant">
              {currentStepData.content}
            </Typography>
          </div>
          
          {/* Actions */}
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="text" onClick={handleSkip}>
              {t('onboarding.skip')}
            </Button>
            
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {currentStep > 0 && (
                <Button variant="outlined" size="small" onClick={prevStep}>
                  {t('common.previous')}
                </Button>
              )}
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
              </Button>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 
                  index < currentStep ? 'bg-primary-300' : 'bg-outline-variant'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Welcome Modal for First Step */}
      {currentStep === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={`bg-surface rounded-lg shadow-xl p-8 max-w-md w-full mx-auto transition-all duration-300 ${
            overlayVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className={`text-center mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="check" size="large" className="text-primary-600" />
              </div>
              <Typography variant="headline-small" color="on-surface" className="font-bold mb-2">
                {t('onboarding.welcome')}
              </Typography>
              <Typography variant="body-medium" color="on-surface-variant">
                Let's take a quick tour to help you get started with managing your car rental inventory.
              </Typography>
            </div>
            
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="text" onClick={handleSkip} className="flex-1">
                {t('onboarding.skip')}
              </Button>
              <Button onClick={nextStep} className="flex-1">
                Start Tour
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTour; 