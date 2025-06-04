import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Accordion, useSuccessToast, useErrorToast } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';
import OfficeConfigSection from '../components/OfficeConfigSection';

interface OfficeConfigData {
  locations: Record<string, boolean>;
  services: Record<string, boolean>;
  delivery: Record<string, boolean>;
}

const OfficeConfigs: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [configs, setConfigs] = useState<OfficeConfigData>({
    locations: {},
    services: {},
    delivery: {},
  });

  // Define configuration options
  const locationOptions = [
    // Al Asimah Governorate
    { key: 'kuwaitCity', labelKey: 'officeConfigs.locations.kuwaitCity' },
    { key: 'dasman', labelKey: 'officeConfigs.locations.dasman' },
    { key: 'sharq', labelKey: 'officeConfigs.locations.sharq' },
    { key: 'mirqab', labelKey: 'officeConfigs.locations.mirqab' },
    { key: 'jiblaAliSalem', labelKey: 'officeConfigs.locations.jiblaAliSalem' },
    { key: 'daiya', labelKey: 'officeConfigs.locations.daiya' },
    { key: 'faiha', labelKey: 'officeConfigs.locations.faiha' },
    { key: 'shamiya', labelKey: 'officeConfigs.locations.shamiya' },
    { key: 'nuzha', labelKey: 'officeConfigs.locations.nuzha' },
    { key: 'wattan', labelKey: 'officeConfigs.locations.wattan' },
    { key: 'bneid', labelKey: 'officeConfigs.locations.bneid' },
    
    // Hawalli Governorate
    { key: 'hawalli', labelKey: 'officeConfigs.locations.hawalli' },
    { key: 'salmiya', labelKey: 'officeConfigs.locations.salmiya' },
    { key: 'shaab', labelKey: 'officeConfigs.locations.shaab' },
    { key: 'rumaithiya', labelKey: 'officeConfigs.locations.rumaithiya' },
    { key: 'bayan', labelKey: 'officeConfigs.locations.bayan' },
    { key: 'mishref', labelKey: 'officeConfigs.locations.mishref' },
    { key: 'salwa', labelKey: 'officeConfigs.locations.salwa' },
    { key: 'jabriiya', labelKey: 'officeConfigs.locations.jabriiya' },
    { key: 'surra', labelKey: 'officeConfigs.locations.surra' },
    
    // Farwaniya Governorate
    { key: 'farwaniya', labelKey: 'officeConfigs.locations.farwaniya' },
    { key: 'jleeb', labelKey: 'officeConfigs.locations.jleeb' },
    { key: 'rabiya', labelKey: 'officeConfigs.locations.rabiya' },
    { key: 'andalous', labelKey: 'officeConfigs.locations.andalous' },
    { key: 'rehab', labelKey: 'officeConfigs.locations.rehab' },
    { key: 'khairan', labelKey: 'officeConfigs.locations.khairan' },
    { key: 'sabahiya', labelKey: 'officeConfigs.locations.sabahiya' },
    { key: 'riggae', labelKey: 'officeConfigs.locations.riggae' },
    
    // Ahmadi Governorate
    { key: 'ahmadi', labelKey: 'officeConfigs.locations.ahmadi' },
    { key: 'fahaheel', labelKey: 'officeConfigs.locations.fahaheel' },
    { key: 'fintas', labelKey: 'officeConfigs.locations.fintas' },
    { key: 'mangaf', labelKey: 'officeConfigs.locations.mangaf' },
    { key: 'mahboula', labelKey: 'officeConfigs.locations.mahboula' },
    { key: 'sabahAlAhmad', labelKey: 'officeConfigs.locations.sabahAlAhmad' },
    { key: 'wafra', labelKey: 'officeConfigs.locations.wafra' },
    
    // Mubarak Al-Kabeer Governorate
    { key: 'mubarakAlKabeer', labelKey: 'officeConfigs.locations.mubarakAlKabeer' },
    { key: 'qurain', labelKey: 'officeConfigs.locations.qurain' },
    { key: 'abuFutaira', labelKey: 'officeConfigs.locations.abuFutaira' },
    { key: 'adan', labelKey: 'officeConfigs.locations.adan' },
    { key: 'qusor', labelKey: 'officeConfigs.locations.qusor' },
    { key: 'sabhan', labelKey: 'officeConfigs.locations.sabhan' },
    
    // Jahra Governorate
    { key: 'jahra', labelKey: 'officeConfigs.locations.jahra' },
    { key: 'qasr', labelKey: 'officeConfigs.locations.qasr' },
    { key: 'warah', labelKey: 'officeConfigs.locations.warah' },
    { key: 'nasseem', labelKey: 'officeConfigs.locations.nasseem' },
    { key: 'sulaibiya', labelKey: 'officeConfigs.locations.sulaibiya' },
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
    const initializeConfigs = () => {
      const initialConfigs: OfficeConfigData = {
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
      setIsLoading(false);
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
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      showSuccess(t('officeConfigs.saveSuccess'));
    } catch (error) {
      showError(t('officeConfigs.saveError'));
      console.error('Error saving office configurations:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Convert option arrays to format expected by OfficeConfigSection
  const formatOptionsForSection = (options: typeof locationOptions, configType: keyof OfficeConfigData) => {
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
          <OfficeConfigSection
            title=""
            description={t('officeConfigs.locationCoverageDesc')}
            options={formatOptionsForSection(locationOptions, 'locations')}
            onOptionChange={handleLocationChange}
          />
        </Accordion>

        {/* Service Options */}
        <Accordion
          title={t('officeConfigs.serviceOptions')}
          defaultExpanded={false}
        >
          <OfficeConfigSection
            title=""
            description={t('officeConfigs.serviceOptionsDesc')}
            options={formatOptionsForSection(serviceOptions, 'services')}
            onOptionChange={handleServiceChange}
          />
        </Accordion>

        {/* Delivery & Pickup */}
        <Accordion
          title={t('officeConfigs.deliveryPickup')}
          defaultExpanded={false}
        >
          <OfficeConfigSection
            title=""
            description={t('officeConfigs.deliveryPickupDesc')}
            options={formatOptionsForSection(deliveryOptions, 'delivery')}
            onOptionChange={handleDeliveryChange}
          />
        </Accordion>
      </div>

      {/* Save Button */}
      <div className={`pt-6 border-t border-outline-variant ${isRTL ? 'text-left' : 'text-right'}`}>
        <Button
          variant="filled"
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-32"
        >
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>

      {/* Development Note */}
      <div className="bg-surface-variant rounded-lg p-6 mt-8">
        <Typography 
          variant="body-small" 
          color="on-surface-variant" 
          className={`${isRTL ? 'text-right' : 'text-left'} italic`}
        >
          💡 {t('common.loading')} Note: This page is functional but currently saves configurations locally. 
          Backend API integration will be implemented in the next phase to persist configurations to the database.
        </Typography>
      </div>
    </div>
  );
};

export default OfficeConfigs; 