import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mo_sami/web-design-system';
import { useLanguage } from '../contexts/LanguageContext';
import { OfficeConfigsApiService, OfficeConfigData, UpdateOfficeConfigsRequest } from '../services/officeConfigsApi';

interface OfficeConfigState {
  locations: Record<string, boolean>;
  services: Record<string, boolean>;
  delivery: Record<string, boolean>;
}

const OfficeConfigs: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [configs, setConfigs] = useState<OfficeConfigState>({
    locations: {},
    services: {},
    delivery: {},
  });

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
          locations: apiConfigs.location_configs || {},
          services: apiConfigs.service_configs || {},
          delivery: apiConfigs.delivery_configs || {},
        });
      } catch (error) {
        console.error('Error loading office configurations:', error);
        
        // Initialize with empty configs on error
        const initialConfigs: OfficeConfigState = {
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

  // Save configurations
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const request: UpdateOfficeConfigsRequest = {
        location_configs: configs.locations,
        service_configs: configs.services,
        delivery_configs: configs.delivery,
      };
      
      await OfficeConfigsApiService.updateOfficeConfigs(request);
    } catch (error) {
      console.error('Error saving office configurations:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Convert option arrays to format expected by ConfigSection
  const formatOptionsForSection = (options: typeof locationOptions, configType: keyof OfficeConfigState) => {
    return options.map(option => ({
      ...option,
      enabled: configs[configType][option.key] || false,
    }));
  };

  // Enhanced Config Section Component
  const ConfigSection = ({ 
    title, 
    description, 
    options, 
    onChange, 
    icon, 
    color 
  }: {
    title: string;
    description: string;
    options: any[];
    onChange: (key: string, enabled: boolean) => void;
    icon: string;
    color: string;
  }) => (
    <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
      <div className={`bg-gradient-to-r ${color} p-6`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="font-sakr font-bold text-xl text-white mb-1">
              {title}
            </h3>
            <p className="font-sakr font-medium text-sm text-white/90">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {options.map((option) => (
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
      </div>
    </div>
  );

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
      <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-8 border border-secondary-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-sakr font-bold text-4xl mb-3 text-secondary-800">
              {t('officeConfigs.title', 'Business Configuration')}
            </h1>
            <p className="font-sakr font-normal text-xl text-secondary-700">
              {t('officeConfigs.description', 'Configure your rental business settings and service offerings')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
            <span className="font-sakr font-medium text-sm text-secondary-600">
              {t('officeConfigs.autoSave', 'Auto-saved')}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-8">
        {/* Location Coverage */}
        <ConfigSection
          title={t('officeConfigs.locationCoverage', 'Location Coverage')}
          description={t('officeConfigs.locationCoverageDesc', 'Select areas where you provide rental services')}
          options={formatOptionsForSection(locationOptions, 'locations')}
          onChange={handleLocationChange}
          icon="🗺️"
          color="from-primary-500 to-primary-600"
        />

        {/* Service Options */}
        <ConfigSection
          title={t('officeConfigs.serviceOptions', 'Service Options')}
          description={t('officeConfigs.serviceOptionsDesc', 'Additional services you offer to customers')}
          options={formatOptionsForSection(serviceOptions, 'services')}
          onChange={handleServiceChange}
          icon="🔧"
          color="from-success-500 to-success-600"
        />

        {/* Delivery & Pickup */}
        <ConfigSection
          title={t('officeConfigs.deliveryPickup', 'Delivery & Pickup')}
          description={t('officeConfigs.deliveryPickupDesc', 'Delivery and pickup options for your customers')}
          options={formatOptionsForSection(deliveryOptions, 'delivery')}
          onChange={handleDeliveryChange}
          icon="🚛"
          color="from-secondary-500 to-secondary-600"
        />
      </div>

      {/* Save Section */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-sakr font-bold text-lg text-on-surface mb-1">
              {t('officeConfigs.saveChanges', 'Save Changes')}
            </h3>
            <p className="font-sakr font-normal text-sm text-on-surface-variant">
              {t('officeConfigs.saveDescription', 'Apply your configuration changes to update your business settings')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              disabled={isSaving}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              isLoading={isSaving}
              className="min-w-32 shadow-lg"
            >
              {t('common.save', 'Save Settings')}
            </Button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h4 className="font-sakr font-bold text-lg text-on-surface mb-2">
              {t('officeConfigs.helpTitle', 'Need Help?')}
            </h4>
            <p className="font-sakr font-normal text-sm text-on-surface-variant leading-relaxed">
              {t('officeConfigs.helpDescription', 'These settings help customers find and book your services. Enable options that match your business capabilities to improve customer satisfaction.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeConfigs; 