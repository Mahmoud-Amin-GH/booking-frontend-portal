import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Progress } from '@mo_sami/web-design-system';
import { useLanguage } from '../contexts/LanguageContext';
import { CarApiService } from '../services/carApi';
import { getCarAttributes, getAttributeOptions } from '../services/attributesApi';

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
      const [carsResponse, attributes] = await Promise.all([
        CarApiService.getCars({ limit: 1, offset: 0 }), // Just to get total count
        getCarAttributes(),
      ]);

      // Calculate available cars (sum of all available_count)
      const allCarsResponse = await CarApiService.getCars({ limit: 1000, offset: 0 });
      const availableCars = allCarsResponse.cars?.reduce((sum, car) => sum + car.available_count, 0) || 0;

      const brandOptions = getAttributeOptions(attributes, 'brand');

      setCarStats({
        totalCars: carsResponse.total || 0,
        availableCars,
        brands: brandOptions.length || 0,
        models: 0, // Will be calculated when we have brand selection
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Enhanced stat cards with modern design
  const StatCard = ({ title, value, subtitle, color, trend, action }: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    trend?: { direction: 'up' | 'down' | 'same'; value: number };
    action: () => void;
  }) => (
    <div
      className="bg-surface rounded-2xl border border-outline-variant p-6 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 cursor-pointer group"
      onClick={action}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="font-sakr font-bold text-3xl mb-2 text-on-surface">
            {statsLoading ? (
              <div className="w-16 h-8 bg-surface-container-highest rounded animate-pulse"></div>
            ) : (
              <span className="group-hover:text-primary-600 transition-colors duration-200">
                {value}
              </span>
            )}
          </div>
          <h3 className="font-sakr font-medium text-lg mb-1 text-on-surface group-hover:text-primary-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="font-sakr font-normal text-sm text-on-surface-variant">
            {subtitle}
          </p>
        </div>

        {trend && (
          <div className="mt-4 pt-3 border-t border-outline-variant/50">
            <div className={`flex items-center gap-1 text-xs font-sakr font-medium ${
              trend.direction === 'up' ? 'text-success' :
              trend.direction === 'down' ? 'text-error' : 'text-on-surface-variant'
            }`}>
              <span>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              </span>
              <span>
                {trend.direction !== 'same' && `${trend.value}% `}
                {t(trend.direction === 'up' ? 'stats.increase' : trend.direction === 'down' ? 'stats.decrease' : 'stats.stable',
                   trend.direction === 'up' ? 'increase' : trend.direction === 'down' ? 'decrease' : 'stable')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const statCards = [
    {
      title: t('stats.totalVehicles', 'Total Vehicles'),
      value: carStats.totalCars,
      subtitle: t('stats.inYourFleet', 'In your fleet'),
      color: 'primary',
      trend: { direction: 'up' as const, value: 12 },
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('stats.availableNow', 'Available Now'),
      value: carStats.availableCars,
      subtitle: t('stats.readyForRental', 'Ready for rental'),
      color: 'success',
      trend: { direction: 'same' as const, value: 0 },
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('stats.totalBrands', 'Total Brands'),
      value: carStats.brands,
      subtitle: t('stats.differentManufacturers', 'Different manufacturers'),
      color: 'secondary',
      trend: { direction: 'up' as const, value: 5 },
      action: () => navigate('/dashboard/cars'),
    },
    {
      title: t('stats.revenue', 'Revenue'),
      value: '—',
      subtitle: t('stats.comingSoon', 'Coming soon'),
      color: 'warning',
      action: () => navigate('/dashboard/office-configs'),
    },
  ];

  return (
    <div className="p-8 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-sakr font-bold text-4xl mb-3 text-primary-800">
              {t('dashboard.welcome', 'Welcome Back!')}
            </h1>
            <p className="font-sakr font-normal text-xl text-primary-700 mb-4">
              {t('dashboard.overviewDescription', 'Here\'s what\'s happening with your car rental business today')}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="font-sakr font-medium text-sm text-primary-600">
                {t('dashboard.systemStatus', 'All systems operational')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard/cars')}
              className="shadow-lg"
            >
              {t('dashboard.addNewCar', 'Add New Car')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard/cars')}
            >
              {t('dashboard.viewInventory', 'View Inventory')}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <div className="mb-6">
          <h2 className="font-sakr font-bold text-2xl text-on-surface mb-2">
            {t('dashboard.overview', 'Business Overview')}
          </h2>
          <p className="font-sakr font-normal text-lg text-on-surface-variant">
            {t('dashboard.keyMetrics', 'Key metrics for your rental business')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-8">
        <div className="mb-6">
          <h3 className="font-sakr font-bold text-2xl text-on-surface mb-2">
            {t('dashboard.quickActions', 'Quick Actions')}
          </h3>
          <p className="font-sakr font-normal text-lg text-on-surface-variant">
            {t('dashboard.quickActionsDesc', 'Common tasks to manage your business')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            className="group bg-primary-50 hover:bg-primary-100 rounded-xl p-6 border border-primary-200 cursor-pointer transition-all duration-200"
            onClick={() => navigate('/dashboard/cars')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-sakr font-bold text-xl">+</span>
              </div>
              <span className="text-primary-600 group-hover:text-primary-700 transition-colors">→</span>
            </div>
            <h4 className="font-sakr font-bold text-lg text-primary-800 mb-1">
              {t('dashboard.addNewCar', 'Add New Car')}
            </h4>
            <p className="font-sakr font-normal text-sm text-primary-600">
              {t('dashboard.addCarDesc', 'Expand your fleet with new vehicles')}
            </p>
          </div>

          <div
            className="group bg-success-50 hover:bg-success-100 rounded-xl p-6 border border-success-200 cursor-pointer transition-all duration-200"
            onClick={() => navigate('/dashboard/cars')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-sakr font-bold text-xl">📊</span>
              </div>
              <span className="text-success-600 group-hover:text-success-700 transition-colors">→</span>
            </div>
            <h4 className="font-sakr font-bold text-lg text-success-800 mb-1">
              {t('dashboard.viewReports', 'View Reports')}
            </h4>
            <p className="font-sakr font-normal text-sm text-success-600">
              {t('dashboard.reportsDesc', 'Analyze your business performance')}
            </p>
          </div>

          <div
            className="group bg-secondary-50 hover:bg-secondary-100 rounded-xl p-6 border border-secondary-200 cursor-pointer transition-all duration-200"
            onClick={() => navigate('/dashboard/office-configs')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-sakr font-bold text-xl">⚙️</span>
              </div>
              <span className="text-secondary-600 group-hover:text-secondary-700 transition-colors">→</span>
            </div>
            <h4 className="font-sakr font-bold text-lg text-secondary-800 mb-1">
              {t('nav.settings', 'Settings')}
            </h4>
            <p className="font-sakr font-normal text-sm text-secondary-600">
              {t('dashboard.settingsDesc', 'Configure your business preferences')}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State Helper (when no cars) */}
      {isEmpty && !isLoading && (
        <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚗</span>
            </div>
            <h3 className="font-sakr font-bold text-2xl text-on-surface mb-3">
              {t('dashboard.emptyState', 'Start Building Your Fleet')}
            </h3>
            <p className="font-sakr font-normal text-lg text-on-surface-variant mb-6">
              {t('dashboard.emptyStateDesc', 'Add your first vehicle to begin managing your car rental business')}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard/cars')}
            >
              {t('dashboard.addFirstCar', 'Add Your First Car')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
