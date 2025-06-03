import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Icon } from '../design_system';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { clearAuthToken } from '../services/api';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const handleNavigateToSection = (sectionIndex: number) => {
    switch (sectionIndex) {
      case 0: // Car Inventory
        navigate('/cars');
        break;
      case 1: // Office Configs
        // TODO: Navigate to office configs page
        break;
      case 2: // Kuwait Locations
        // TODO: Navigate to locations page
        break;
      case 3: // User Management
        // TODO: Navigate to user management page
        break;
      default:
        break;
    }
  };

  const dashboardCards = [
    {
      title: t('dashboard.carInventory'),
      description: t('dashboard.carInventoryDesc'),
      icon: 'user' as const,
      items: [
        t('dashboard.manageBrand'),
        t('dashboard.manageSeats'),
        t('dashboard.manageColors'),
        t('dashboard.manageTransmission')
      ],
    },
    {
      title: t('dashboard.officeConfigs'),
      description: t('dashboard.officeConfigsDesc'),
      icon: 'check' as const,
      items: [
        t('dashboard.service24h'),
        t('dashboard.fullInsurance'),
        t('dashboard.roadServices'),
        t('dashboard.driverOptions')
      ],
    },
    {
      title: t('dashboard.kuwaitLocations'),
      description: t('dashboard.kuwaitLocationsDesc'),
      icon: 'phone' as const,
      items: [
        t('dashboard.hawalliDistrict'),
        t('dashboard.salmiyaArea'),
        t('dashboard.farwaniyaRegion'),
        t('dashboard.alJahraZone')
      ],
    },
    {
      title: t('dashboard.userManagement'),
      description: t('dashboard.userManagementDesc'),
      icon: 'email' as const,
      items: [
        t('dashboard.customerProfiles'),
        t('dashboard.bookingHistory'),
        t('dashboard.paymentMethods'),
        t('dashboard.preferences')
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Top Navigation */}
      <header className="bg-surface-bright shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Typography variant="title-large" color="primary">
              {t('dashboard.portalTitle')}
            </Typography>
            
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                variant="outlined" 
                onClick={handleLogout}
                icon={<Icon name="arrow-right" />}
                iconPosition="end"
              >
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Typography variant="display-medium" color="primary" className="mb-4">
            {t('common.dashboard')}
          </Typography>
          <Typography variant="body-large" color="on-surface-variant">
            {t('dashboard.welcome')}
          </Typography>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-surface-bright rounded-lg shadow-elevation-2 p-6 hover:shadow-elevation-3 transition-all duration-250 border border-outline"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name={card.icon} size="medium" className="text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <Typography variant="title-large" color="on-surface" className="mb-2">
                    {card.title}
                  </Typography>
                  <Typography variant="body-2xs" color="on-surface-variant">
                    {card.description}
                  </Typography>
                </div>
              </div>

              <div className="space-y-2">
                {card.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                    <Typography variant="body-2xs" color="on-surface">
                      {item}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button 
                  variant="text" 
                  icon={<Icon name="arrow-right" />} 
                  iconPosition="end"
                  onClick={() => handleNavigateToSection(index)}
                >
                  {t('dashboard.manage', { item: card.title })}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Section */}
        <div className="bg-surface-bright rounded-lg shadow-elevation-1 p-6 border border-outline">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="check" size="large" className="text-success" />
            </div>
            
            <Typography variant="headline-small" color="success">
              {t('dashboard.systemReady')}
            </Typography>
            
            <Typography variant="body-medium" color="on-surface-variant">
              {t('dashboard.systemReadyDesc')}
            </Typography>

            <div className="flex justify-center gap-4 mt-6">
              <Button variant="filled" onClick={() => navigate('/cars')}>
                {t('dashboard.addNewCar')}
              </Button>
              <Button variant="outlined">
                {t('dashboard.viewReports')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 