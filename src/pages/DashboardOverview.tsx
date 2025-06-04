import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Typography, Button, Icon } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';
import { CarApiService } from '../services/carApi';

// Inventory context type from DashboardLayout
interface InventoryContext {
  isEmpty: boolean;
  isLoading: boolean;
  refreshStatus: () => void;
}

const DashboardOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  
  // Get inventory context from outlet
  const inventoryContext = useOutletContext<InventoryContext>();

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

  // Enhanced stat cards with trend indicators and better visual design
  const StatCard = ({ title, value, subtitle, icon, color, trend, action }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: string;
    trend?: { direction: 'up' | 'down' | 'same'; value: number };
    action: () => void;
  }) => (
    <div
      className="bg-surface rounded-lg border border-outline-variant p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={action}
    >
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`p-3 rounded-lg ${color} transition-transform group-hover:scale-110`}>
          <Icon name={icon} size="medium" />
        </div>
        {trend && (
          <div className={`text-sm flex items-center gap-1 ${
            trend.direction === 'up' ? 'text-green-600' : 
            trend.direction === 'down' ? 'text-red-600' : 'text-on-surface-variant'
          }`}>
            <Icon 
              name={trend.direction === 'up' ? 'arrow-right' : trend.direction === 'down' ? 'arrow-left' : 'arrow-right'} 
              size="small" 
            />
            {t(`stats.trend.${trend.direction}`, { value: trend.value })}
          </div>
        )}
      </div>
      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="headline-large" color="on-surface" className="font-bold mb-1">
          {statsLoading ? (
            <div className="w-16 h-8 bg-outline animate-pulse rounded"></div>
          ) : (
            value
          )}
        </Typography>
        <Typography variant="label-medium" color="on-surface-variant" className="mb-1">
          {title}
        </Typography>
        <Typography variant="body-small" color="on-surface-variant">
          {subtitle}
        </Typography>
      </div>
    </div>
  );

  const statCards = [
    {
      title: t('stats.totalVehicles'),
      value: carStats.totalCars,
      subtitle: 'In your fleet',
      icon: 'user' as const,
      color: 'bg-blue-100 text-blue-700',
      trend: { direction: 'up' as const, value: 12 },
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('stats.availableNow'),
      value: carStats.availableCars,
      subtitle: 'Ready for rental',
      icon: 'check' as const,
      color: 'bg-green-100 text-green-700',
      trend: { direction: 'same' as const, value: 0 },
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('stats.totalBrands'),
      value: carStats.brands,
      subtitle: 'Different manufacturers',
      icon: 'phone' as const,
      color: 'bg-purple-100 text-purple-700',
      trend: { direction: 'up' as const, value: 5 },
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('stats.revenue'),
      value: '—',
      subtitle: 'Coming soon',
      icon: 'email' as const,
      color: 'bg-orange-100 text-orange-700',
      action: () => navigate('/dashboard/office-configs'),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="headline-medium" color="on-surface" className="font-bold mb-2">
          {t('dashboard.welcome')}
        </Typography>
        <Typography variant="body-large" color="on-surface-variant">
          {t('dashboard.systemReadyDesc')}
        </Typography>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
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
            className={`justify-start gap-3 hover:bg-primary-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon name="user" size="small" />
            <span>{t('dashboard.addNewCar')}</span>
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard/cars')}
            className={`justify-start gap-3 hover:bg-green-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon name="check" size="small" />
            <span>{t('dashboard.viewReports')}</span>
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard/office-configs')}
            className={`justify-start gap-3 hover:bg-purple-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon name="phone" size="small" />
            <span>{t('nav.settings')}</span>
          </Button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className={`bg-surface rounded-lg border border-outline-variant p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="title-medium" color="on-surface" className="font-medium mb-4">
          Recent Activity
        </Typography>
        <div className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-primary-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
            <Typography variant="body-medium" color="on-surface">
              System initialized and ready for inventory management
            </Typography>
            <Typography variant="body-small" color="on-surface-variant" className="ml-auto">
              Just now
            </Typography>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-green-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <Typography variant="body-medium" color="on-surface">
              Car inventory system is operational
            </Typography>
            <Typography variant="body-small" color="on-surface-variant" className="ml-auto">
              2 min ago
            </Typography>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-blue-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <Typography variant="body-medium" color="on-surface">
              Authentication system is secure and active
            </Typography>
            <Typography variant="body-small" color="on-surface-variant" className="ml-auto">
              5 min ago
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 