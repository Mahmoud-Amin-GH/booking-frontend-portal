import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Icon } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';
import { CarApiService } from '../services/carApi';

const DashboardOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [statsLoading, setStatsLoading] = useState(true);
  const [carStats, setCarStats] = useState({
    totalCars: 0,
    availableCars: 0,
    brands: 0,
    models: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true);
      // Get basic car inventory stats
      const [carsResponse, optionsResponse] = await Promise.all([
        CarApiService.getCars({ limit: 1, offset: 0 }), // Just to get total count
        CarApiService.getCarOptions(),
      ]);

      // Calculate available cars (sum of all available_count)
      const allCarsResponse = await CarApiService.getCars({ limit: 1000, offset: 0 });
      const availableCars = allCarsResponse.cars?.reduce((sum, car) => sum + car.available_count, 0) || 0;

      setCarStats({
        totalCars: carsResponse.total || 0,
        availableCars,
        brands: optionsResponse.options?.brands?.length || 0,
        models: 0, // Will be calculated when we have brand selection
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.carInventory'),
      value: carStats.totalCars,
      subtitle: t('cars.noCars'),
      icon: 'user' as const,
      color: 'bg-primary-100 text-primary-700',
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('cars.available'),
      value: carStats.availableCars,
      subtitle: 'Total available vehicles',
      icon: 'check' as const,
      color: 'bg-green-100 text-green-700',
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('cars.brand'),
      value: carStats.brands,
      subtitle: 'Different brands',
      icon: 'phone' as const,
      color: 'bg-blue-100 text-blue-700',
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('dashboard.officeConfigs'),
      value: '—',
      subtitle: 'Coming soon',
      icon: 'email' as const,
      color: 'bg-purple-100 text-purple-700',
      action: () => navigate('/dashboard/office-configs'),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="headline-medium" color="on-surface" className="font-bold mb-2">
          {t('dashboard.welcome')}
        </Typography>
        <Typography variant="body-large" color="on-surface-variant">
          {t('dashboard.systemReadyDesc')}
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-surface rounded-lg border border-outline-variant p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={card.action}
          >
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                <Typography variant="label-medium" color="on-surface-variant" className="mb-2">
                  {card.title}
                </Typography>
                <Typography variant="headline-small" color="on-surface" className="font-bold mb-1">
                  {statsLoading ? '...' : card.value}
                </Typography>
                <Typography variant="body-small" color="on-surface-variant">
                  {card.subtitle}
                </Typography>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon name={card.icon} size="medium" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`bg-surface rounded-lg border border-outline-variant p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="title-medium" color="on-surface" className="font-medium mb-4">
          Quick Actions
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard/cars')}
            className={`justify-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon name="user" size="small" />
            <span>{t('dashboard.addNewCar')}</span>
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard/cars')}
            className={`justify-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon name="check" size="small" />
            <span>{t('dashboard.viewReports')}</span>
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard/office-configs')}
            className={`justify-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon name="phone" size="small" />
            <span>{t('dashboard.officeConfigs')}</span>
          </Button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className={`bg-surface rounded-lg border border-outline-variant p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="title-medium" color="on-surface" className="font-medium mb-4">
          Recent Activity
        </Typography>
        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <Typography variant="body-medium" color="on-surface-variant">
              System initialized and ready for inventory management
            </Typography>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <Typography variant="body-medium" color="on-surface-variant">
              Car inventory system is operational
            </Typography>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <Typography variant="body-medium" color="on-surface-variant">
              Authentication system is secure and active
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 