import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Button,
  Input,
  Modal,
  ModalFooter,
  Alert,
} from '@mo_sami/web-design-system';
import * as Select from '@radix-ui/react-select';
import { Plus, Calendar, ChevronDown } from 'lucide-react';
import { 
  CarAvailabilityPeriod,
  AvailabilityApi,
  AvailabilityMetrics
} from '../services/availabilityApi';
import { CarApi, Car } from '../services/carApi';
import { DatePicker } from '../design_system/components/DatePicker';

const CarAvailability: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // State
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [availabilityPeriods, setAvailabilityPeriods] = useState<CarAvailabilityPeriod[]>([]);
  const [metrics, setMetrics] = useState<AvailabilityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<CarAvailabilityPeriod | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    car_id: 0,
    start_date: '',
    end_date: '',
    available_count: 1,
    period_type: 'available' as CarAvailabilityPeriod['period_type'],
    reason: ''
  });

  // Load cars and availability data
  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    if (selectedCarId) {
      loadAvailabilityData();
    }
  }, [selectedCarId]);

  const loadCars = async () => {
    try {
      const response = await CarApi.getCars();
      setCars(response.cars);
      if (response.cars.length > 0 && !selectedCarId) {
        setSelectedCarId(response.cars[0].id);
      }
    } catch (error) {
      showError(t('availability.errors.loadCars'));
    }
  };

  const loadAvailabilityData = async () => {
    if (!selectedCarId) return;
    setLoading(true);
    try {
      // Get availability periods
      const periods = await AvailabilityApi.getAvailabilityPeriods({
        car_id: selectedCarId
      });
      setAvailabilityPeriods(periods);

      // Get metrics for the current month
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      const metrics = await AvailabilityApi.getAvailabilityMetrics(selectedCarId, startDate, endDate);
      setMetrics(metrics);
    } catch (error) {
      showError(t('availability.errors.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingPeriod) {
        await AvailabilityApi.updateAvailabilityPeriod(editingPeriod.id, formData);
        showSuccess(t('availability.success.updated'));
      } else {
        await AvailabilityApi.createAvailabilityPeriod(formData);
        showSuccess(t('availability.success.created'));
      }
      setModalOpen(false);
      loadAvailabilityData();
    } catch (error) {
      showError(t('availability.errors.save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccess = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showError = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetForm = () => {
    setFormData({
      car_id: selectedCarId || 0,
      start_date: '',
      end_date: '',
      available_count: 1,
      period_type: 'available',
      reason: ''
    });
    setEditingPeriod(null);
  };

  const handleCarChange = (carId: number) => {
    setSelectedCarId(carId);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <p className="font-sakr font-medium text-lg text-on-surface-variant">
            {t('common.loading')}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
            {t('availability.title')}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('availability.subtitle')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            {t('availability.addPeriod')}
          </Button>
        </div>
      </div>

      {/* Toast Messages */}
      {showToast && (
        <Alert variant={toastType === 'error' ? 'error' : 'success'}>
          {toastMessage}
        </Alert>
      )}

      {/* Car Selection */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-6">
        <div className="mb-4">
          <h3 className="font-sakr font-bold text-lg text-on-surface mb-2">
            {t('availability.selectCar')}
          </h3>
          <Select.Root
            value={selectedCarId?.toString() || ''}
            onValueChange={(value) => handleCarChange(Number(value))}
          >
            <Select.Trigger className="w-full">
              <Select.Value placeholder={t('availability.selectCar')} />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                {cars.map((car) => (
                  <Select.Item key={car.id} value={car.id.toString()}>
                    <Select.ItemText>
                      {car.brand_name} {car.model_name} ({car.year})
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
              <h4 className="font-sakr font-medium text-sm text-primary-900 mb-1">
                {t('availability.metrics.utilization')}
              </h4>
              <p className="font-sakr font-bold text-2xl text-primary-700">
                {metrics.utilization_rate}%
              </p>
            </div>
            <div className="bg-success-50 rounded-xl p-4 border border-success-100">
              <h4 className="font-sakr font-medium text-sm text-success-900 mb-1">
                {t('availability.metrics.availableDays')}
              </h4>
              <p className="font-sakr font-bold text-2xl text-success-700">
                {metrics.total_available_days}
              </p>
            </div>
            <div className="bg-warning-50 rounded-xl p-4 border border-warning-100">
              <h4 className="font-sakr font-medium text-sm text-warning-900 mb-1">
                {t('availability.metrics.maintenanceDays')}
              </h4>
              <p className="font-sakr font-bold text-2xl text-warning-700">
                {metrics.total_maintenance_days}
              </p>
            </div>
            <div className="bg-error-50 rounded-xl p-4 border border-error-100">
              <h4 className="font-sakr font-medium text-sm text-error-900 mb-1">
                {t('availability.metrics.blockedDays')}
              </h4>
              <p className="font-sakr font-bold text-2xl text-error-700">
                {metrics.total_blocked_days}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Availability Periods Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('availability.table.period')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('availability.table.type')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('availability.table.count')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('availability.table.reason')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('availability.table.actions')}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {availabilityPeriods.map((period) => (
                <tr key={period.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-sakr font-medium text-on-surface">
                      {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-sakr font-medium px-3 py-1 rounded-full ${
                      period.period_type === 'available' ? 'bg-success-100 text-success-700' :
                      period.period_type === 'maintenance' ? 'bg-warning-100 text-warning-700' :
                      period.period_type === 'blocked' ? 'bg-error-100 text-error-700' :
                      'bg-primary-100 text-primary-700'
                    }`}>
                      {t(`availability.types.${period.period_type}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sakr font-medium text-on-surface">
                      {period.available_count}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sakr font-normal text-on-surface-variant">
                      {period.reason || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setEditingPeriod(period);
                          setFormData({
                            car_id: period.car_id,
                            start_date: period.start_date,
                            end_date: period.end_date,
                            available_count: period.available_count,
                            period_type: period.period_type,
                            reason: period.reason || ''
                          });
                          setModalOpen(true);
                        }}
                      >
                        {t('common.edit')}
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={async () => {
                          try {
                            await AvailabilityApi.deleteAvailabilityPeriod(period.id);
                            showSuccess(t('availability.success.deleted'));
                            loadAvailabilityData();
                          } catch (error) {
                            showError(t('availability.errors.delete'));
                          }
                        }}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingPeriod ? t('availability.editPeriod') : t('availability.addPeriod')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label={t('availability.form.startDate')}
              selected={formData.start_date ? new Date(formData.start_date) : null}
              onChange={(date) => setFormData({ ...formData, start_date: date ? date.toISOString().split('T')[0] : '' })}
              fullWidth
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              label={t('availability.form.endDate')}
              selected={formData.end_date ? new Date(formData.end_date) : null}
              onChange={(date) => setFormData({ ...formData, end_date: date ? date.toISOString().split('T')[0] : '' })}
              fullWidth
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <Select.Root
            value={formData.period_type}
            onValueChange={(value) => setFormData({ ...formData, period_type: value as CarAvailabilityPeriod['period_type'] })}
          >
            <Select.Trigger className="w-full">
              <Select.Value placeholder={t('availability.form.type')} />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Item value="available">
                  <Select.ItemText>{t('availability.types.available')}</Select.ItemText>
                </Select.Item>
                <Select.Item value="maintenance">
                  <Select.ItemText>{t('availability.types.maintenance')}</Select.ItemText>
                </Select.Item>
                <Select.Item value="blocked">
                  <Select.ItemText>{t('availability.types.blocked')}</Select.ItemText>
                </Select.Item>
                <Select.Item value="booking">
                  <Select.ItemText>{t('availability.types.booking')}</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <Input
            type="number"
            label={t('availability.form.count')}
            value={formData.available_count}
            onChange={(e) => setFormData({ ...formData, available_count: parseInt(e.target.value) })}
            min={0}
            fullWidth
          />

          <Input
            label={t('availability.form.reason')}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder={t('availability.form.reasonPlaceholder')}
            fullWidth
          />
        </form>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CarAvailability; 