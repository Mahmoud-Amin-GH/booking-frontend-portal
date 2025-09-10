import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from '@mo_sami/web-design-system';
import { useLanguage } from '../contexts/LanguageContext';
import { OfficeConfigsApiService, OfficeConfigData, UpdateOfficeConfigsRequest } from '../services/officeConfigsApi';
import { MapIcon, Cog6ToothIcon, TruckIcon, ChevronDownIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Input,
  Modal,
  ModalFooter
} from '@mo_sami/web-design-system';

interface OfficeConfigState {
  address: string;
  locations: Record<string, boolean>;
  services: Record<string, boolean>;
  delivery: Record<string, boolean>;
}

const OfficeConfigs: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [configs, setConfigs] = useState<OfficeConfigState>({
    address: '',
    locations: {},
    services: {},
    delivery: {},
  });

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressInput, setAddressInput] = useState('');

  // Define configuration options - Main Districts Only
  const locationOptions = [
    // Main Districts (one per governorate)
    { key: 'kuwaitCity', labelKey: 'officeConfigs.locations.kuwaitCity' },
    { key: 'hawalli', labelKey: 'officeConfigs.locations.hawalli' },
    { key: 'farwaniya', labelKey: 'officeConfigs.locations.farwaniya' },
    { key: 'ahmadi', labelKey: 'officeConfigs.locations.ahmadi' },
    { key: 'mubarakAlKabeer', labelKey: 'officeConfigs.locations.mubarakAlKabeer' },
    { key: 'jahra', labelKey: 'officeConfigs.locations.jahra' },
  ];

  const serviceOptions = [
    { 
      key: '24hours', 
      labelKey: 'officeConfigs.services.24hours',
      descriptionKey: 'officeConfigs.services.24hoursDesc'
    },
    { 
      key: 'fullInsurance', 
      labelKey: 'officeConfigs.services.fullInsurance',
      descriptionKey: 'officeConfigs.services.fullInsuranceDesc'
    },
    { 
      key: 'roadAssistance', 
      labelKey: 'officeConfigs.services.roadAssistance',
      descriptionKey: 'officeConfigs.services.roadAssistanceDesc'
    },
    { 
      key: 'withDriver', 
      labelKey: 'officeConfigs.services.withDriver',
      descriptionKey: 'officeConfigs.services.withDriverDesc'
    },
  ];

  const deliveryOptions = [
    { 
      key: 'airportDelivery', 
      labelKey: 'officeConfigs.delivery.airportDelivery',
      descriptionKey: 'officeConfigs.delivery.airportDeliveryDesc'
    },
    { 
      key: 'homeDelivery', 
      labelKey: 'officeConfigs.delivery.homeDelivery',
      descriptionKey: 'officeConfigs.delivery.homeDeliveryDesc'
    },
    { 
      key: 'noConditions', 
      labelKey: 'officeConfigs.delivery.noConditions',
      descriptionKey: 'officeConfigs.delivery.noConditionsDesc'
    },
    { 
      key: 'freeCancellation', 
      labelKey: 'officeConfigs.delivery.freeCancellation',
      descriptionKey: 'officeConfigs.delivery.freeCancellationDesc'
    },
  ];

  // Initialize configurations with all options disabled
  useEffect(() => {
    const initializeConfigs = async () => {
      try {
        const apiConfigs = await OfficeConfigsApiService.getOfficeConfigs();
        
        // Convert API response to local state format
        setConfigs({
          address: apiConfigs.address || '',
          locations: apiConfigs.location_configs || {},
          services: apiConfigs.service_configs || {},
          delivery: apiConfigs.delivery_configs || {},
        });
      } catch (error) {
        console.error('Error loading office configurations:', error);
        
        // Initialize with empty configs on error
        const initialConfigs: OfficeConfigState = {
          address: '',
          locations: {},
          services: {},
          delivery: {},
        };

        // Initialize all location options as disabled
        locationOptions.forEach(option => {
          initialConfigs.locations[option.key] = false;
        });

        // Initialize all service options as disabled
        serviceOptions.forEach(option => {
          initialConfigs.services[option.key] = false;
        });

        // Initialize all delivery options as disabled
        deliveryOptions.forEach(option => {
          initialConfigs.delivery[option.key] = false;
        });

        setConfigs(initialConfigs);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConfigs();
  }, []);

  // Show alert message
  const showAlertMessage = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Handle option changes
  const handleLocationChange = (optionKey: string, enabled: boolean) => {
    setConfigs(prev => ({
      ...prev,
      locations: {
        ...prev.locations,
        [optionKey]: enabled,
      },
    }));
  };

  const handleServiceChange = (optionKey: string, enabled: boolean) => {
    setConfigs(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [optionKey]: enabled,
      },
    }));
  };

  const handleDeliveryChange = (optionKey: string, enabled: boolean) => {
    setConfigs(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [optionKey]: enabled,
      },
    }));
  };

  const handleInlineAddressChange = (value: string) => {
    // Keep editing state, do not switch views
    setConfigs(prev => ({ ...prev, address: value }));
  };

  const openAddressModal = () => {
    setAddressInput(configs.address || '');
    setAddressModalOpen(true);
  };

  const handleSaveAddressModal = () => {
    setConfigs(prev => ({ ...prev, address: addressInput.trim() }));
    setAddressModalOpen(false);
  };

  // Save configurations
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const request: UpdateOfficeConfigsRequest = {
        address: configs.address || '',
        location_configs: configs.locations,
        service_configs: configs.services,
        delivery_configs: configs.delivery,
      };
      
      await OfficeConfigsApiService.updateOfficeConfigs(request);
      showAlertMessage(t('officeConfigs.saveSuccess'), 'success');
    } catch (error) {
      console.error('Error saving office configurations:', error);
      showAlertMessage(t('officeConfigs.saveError'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Convert option arrays to format expected by ConfigSection
  const formatOptionsForSection = (options: Array<{ key: string; labelKey: string; descriptionKey?: string }>, configType: keyof OfficeConfigState) => {
    return options.map(option => ({
      ...option,
      enabled: (configs[configType] as Record<string, boolean>)[option.key] || false,
    }));
  };

  const ACCORDION_SECTIONS = [
    {
      key: 'locations',
      titleKey: 'officeConfigs.locationCoverage',
      descKey: 'officeConfigs.locationCoverageDesc',
      icon: <MapIcon className="w-7 h-7 text-primary-600" />,
      color: 'from-primary-400 to-primary-600',
      optionsKey: 'locationOptions',
      onChange: 'handleLocationChange',
    },
    {
      key: 'services',
      titleKey: 'officeConfigs.serviceOptions',
      descKey: 'officeConfigs.serviceOptionsDesc',
      icon: <Cog6ToothIcon className="w-7 h-7 text-secondary-600" />,
      color: 'from-secondary-400 to-secondary-600',
      optionsKey: 'serviceOptions',
      onChange: 'handleServiceChange',
    },
    {
      key: 'delivery',
      titleKey: 'officeConfigs.deliveryPickup',
      descKey: 'officeConfigs.deliveryPickupDesc',
      icon: <TruckIcon className="w-7 h-7 text-success-600" />,
      color: 'from-success-400 to-success-600',
      optionsKey: 'deliveryOptions',
      onChange: 'handleDeliveryChange',
    },
  ];

  const [openSection, setOpenSection] = useState('address');

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <p className="font-sakr font-medium text-lg text-on-surface-variant">
            {t('common.loading', 'Loading')}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-8 border border-secondary-200 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full">
          <div className="flex-1">
            <h1 className="font-sakr font-bold text-4xl mb-3 text-secondary-800">
              {t('officeConfigs.title', 'Business Configuration')}
            </h1>
            <p className="font-sakr font-normal text-xl text-secondary-700">
              {t('officeConfigs.description', 'Configure your rental business settings and service offerings')}
            </p>
          </div>
          {/* Help text with lamp icon */}
          <div className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-3 shadow-sm">
            <LightBulbIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <span className="font-sakr font-medium text-sm text-secondary-700">
              {t('officeConfigs.helpDescription', 'These settings help customers find and book your services. Enable options that match your business capabilities to improve customer satisfaction.')}
            </span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {showAlert && (
        <Alert variant={alertType === 'error' ? 'error' : 'success'}>
          {alertMessage}
        </Alert>
      )}

      {/* Accordion UI using DS Accordion */}
      <Accordion
        type="single"
        collapsible
        value={openSection}
        onValueChange={v => setOpenSection(typeof v === 'string' ? v : '')}
        className="w-full space-y-4"
      >
        {/* Address Section - FIRST */}
        <AccordionItem value="address" key="address">
          <AccordionTrigger className={`flex items-center justify-between w-full px-6 py-5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl focus:outline-none`}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-2 flex items-center justify-center">
                <MapIcon className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <div className={`flex flex-col items-start text-start`}>
                  <h3 className="font-sakr font-bold text-lg text-on-surface mb-1">{t('officeConfigs.address.title')}</h3>
                  <p className="font-sakr font-medium text-xs text-on-surface-variant">{t('officeConfigs.address.desc')}</p>
                </div>
              </div>
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-white ml-2 transition-transform duration-200 ${openSection === 'address' ? 'rotate-180' : ''}`} />
          </AccordionTrigger>
          <AccordionContent className="bg-white px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="block font-sakr font-medium text-sm text-gray-700 mb-2">
                  {t('officeConfigs.address.inputLabel')}
                </label>
                <Input
                  value={configs.address}
                  onChange={(e: any) => handleInlineAddressChange(e.target.value)}
                  placeholder={t('officeConfigs.address.placeholder')}
                />
                <p className="font-sakr text-xs text-on-surface-variant mt-2">
                  {t('officeConfigs.address.helper')}
                </p>
              </div>
              {configs.address && (
                <div className="pt-6">
                  <Button variant="text" size="small" onClick={openAddressModal}>
                    {t('common.edit')}
                  </Button>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {ACCORDION_SECTIONS.map(section => {
          const options = section.optionsKey === 'locationOptions' ? locationOptions : section.optionsKey === 'serviceOptions' ? serviceOptions : deliveryOptions;
          const onChange = section.onChange === 'handleLocationChange' ? handleLocationChange : section.onChange === 'handleServiceChange' ? handleServiceChange : handleDeliveryChange;
          const formattedOptions = formatOptionsForSection(options, section.key as keyof OfficeConfigState);
          const isOpen = openSection === section.key;
          return (
            <AccordionItem value={section.key} key={section.key}>
              <AccordionTrigger className={`flex items-center justify-between w-full px-6 py-5 bg-gradient-to-r ${section.color} rounded-2xl focus:outline-none`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-xl p-2 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div>
                    <div className={`flex flex-col items-start text-start`}>
                      <h3 className="font-sakr font-bold text-lg text-on-surface mb-1">{t(section.titleKey)}</h3>
                      <p className="font-sakr font-medium text-xs text-on-surface-variant">{t(section.descKey)}</p>
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-white ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formattedOptions.map((option) => (
                    <label
                      key={option.key}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer transition-all duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={option.enabled}
                        onChange={(e) => onChange(option.key, e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-outline-variant text-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <span className="font-sakr font-medium text-lg text-on-surface group-hover:text-primary-700 transition-colors duration-200">
                          {t(option.labelKey)}
                        </span>
                        {option.descriptionKey && (
                          <p className="font-sakr font-normal text-sm text-on-surface-variant mt-1 leading-relaxed">
                            {t(option.descriptionKey)}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Save Button */}
      <div className="flex justify-end w-full pt-4">
        <Button onClick={handleSave} disabled={isSaving} variant="primary" size="lg">
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>

      {/* Address Edit Modal */}
      <Modal
        open={addressModalOpen}
        onOpenChange={(open) => setAddressModalOpen(open)}
        title={t('officeConfigs.address.editTitle')}
        size="lg"
      >
        <div className="space-y-4 pb-4">
          <div>
            <label className="block font-sakr font-medium text-sm text-gray-700 mb-2">
              {t('officeConfigs.address.inputLabel')}
            </label>
            <Input
              value={addressInput}
              onChange={(e: any) => setAddressInput(e.target.value)}
              placeholder={t('officeConfigs.address.placeholder')}
            />
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button
              variant="text"
              onClick={() => setAddressModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveAddressModal}>
              {t('common.save')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OfficeConfigs; 