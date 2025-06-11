import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Accordion, Typography } from '../design_system';
// import { OfficeConfigSection } from '../design_system';
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

  // Convert option arrays to format expected by OfficeConfigSection
  const formatOptionsForSection = (options: typeof locationOptions, configType: keyof OfficeConfigState) => {
    return options.map(option => ({
      ...option,
      enabled: configs[configType][option.key] || false,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <Typography variant="body-medium" color="on-surface-variant">
            {t('common.loading')}...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="headline-medium" color="on-surface" className="font-bold mb-2">
          {t('officeConfigs.title')}
        </Typography>
        <Typography variant="body-large" color="on-surface-variant">
          {t('officeConfigs.description')}
        </Typography>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-6">
        {/* Location Coverage */}
        <Accordion
          title={t('officeConfigs.locationCoverage')}
          defaultExpanded={true}
        >
          <div className="space-y-4 p-4">
            <Typography variant="body-medium" className="text-gray-600 mb-4">
              {t('officeConfigs.locationCoverageDesc')}
            </Typography>
            <div className="space-y-3">
              {formatOptionsForSection(locationOptions, 'locations').map((option) => (
                <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={(e) => handleLocationChange(option.key, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="font-sakr">{t(option.labelKey)}</span>
                </label>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Service Options */}
        <Accordion
          title={t('officeConfigs.serviceOptions')}
          defaultExpanded={false}
        >
          <div className="space-y-4 p-4">
            <Typography variant="body-medium" className="text-gray-600 mb-4">
              {t('officeConfigs.serviceOptionsDesc')}
            </Typography>
            <div className="space-y-3">
              {formatOptionsForSection(serviceOptions, 'services').map((option) => (
                <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={(e) => handleServiceChange(option.key, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-sakr">{t(option.labelKey)}</span>
                    {(option as any).descriptionKey && (
                      <p className="text-sm text-gray-500 mt-1">{t((option as any).descriptionKey)}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Delivery & Pickup */}
        <Accordion
          title={t('officeConfigs.deliveryPickup')}
          defaultExpanded={false}
        >
          <div className="space-y-4 p-4">
            <Typography variant="body-medium" className="text-gray-600 mb-4">
              {t('officeConfigs.deliveryPickupDesc')}
            </Typography>
            <div className="space-y-3">
              {formatOptionsForSection(deliveryOptions, 'delivery').map((option) => (
                <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={(e) => handleDeliveryChange(option.key, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-sakr">{t(option.labelKey)}</span>
                    {(option as any).descriptionKey && (
                      <p className="text-sm text-gray-500 mt-1">{t((option as any).descriptionKey)}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Accordion>
      </div>

      {/* Save Button */}
      <div className={`pt-6 border-t border-outline-variant ${isRTL ? 'text-left' : 'text-right'}`}>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-32"
        >
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </div>
  );
};

export default OfficeConfigs; 