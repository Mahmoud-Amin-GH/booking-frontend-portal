import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Progress } from '@mo_sami/web-design-system';
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
  
  // Use inventory context to refresh status when needed
  const { isEmpty, isLoading, refreshStatus } = inventoryContext || { isEmpty: false, isLoading: false, refreshStatus: () => {} };

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
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={action}
    >
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`p-3 rounded-lg ${color} transition-transform group-hover:scale-110`}>
          <Icon name={icon} size="medium" />
        </div>
        {trend && (
          <div className={`text-sm flex items-center gap-1 ${
            trend.direction === 'up' ? 'text-green-600' : 
            trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
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
        <div className="font-sakr font-bold text-3xl mb-1 text-gray-900">
          {statsLoading ? (
            <Progress variant="default" className="w-16 h-2" />
          ) : (
            value
          )}
        </div>
        <p className="font-sakr font-medium text-base mb-1 text-gray-600">
          {title}
        </p>
        <p className="font-sakr font-normal text-sm text-gray-500">
          {subtitle}
        </p>
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
        <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
          {t('dashboard.welcome')}
        </h2>
        <p className="font-sakr font-normal text-lg text-gray-600">
          {t('dashboard.systemReadyDesc')}
        </p>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h3 className="font-sakr font-medium text-xl mb-4 text-gray-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard/cars')}
            className={`justify-start gap-3 hover:bg-primary-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            prefix={<Icon name="user" size="small" />}
          >
            {t('dashboard.addNewCar')}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard/cars')}
            className={`justify-start gap-3 hover:bg-green-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {t('dashboard.viewReports')}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard/office-configs')}
            className={`justify-start gap-3 hover:bg-purple-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {t('nav.settings')}
          </Button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h3 className="font-sakr font-medium text-xl mb-4 text-gray-900">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-primary-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
            <p className="font-sakr font-normal text-base text-gray-900">
              System initialized and ready for inventory management
            </p>
            <span className="font-sakr font-normal text-sm ml-auto text-gray-500">
              Just now
            </span>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-green-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="font-sakr font-normal text-base text-gray-900">
              Car inventory system is operational
            </p>
            <span className="font-sakr font-normal text-sm ml-auto text-gray-500">
              2 min ago
            </span>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-blue-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <p className="font-sakr font-normal text-base text-gray-900">
              Authentication system is secure and active
            </p>
            <span className="font-sakr font-normal text-sm ml-auto text-gray-500">
              5 min ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 