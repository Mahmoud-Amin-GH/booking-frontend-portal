import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Button,
  Input,
  Modal,
  ModalFooter,
  Alert,
  Select,
} from '@mo_sami/web-design-system';
import { Plus } from 'lucide-react';
import { 
  MaintenanceSchedule as MaintenanceScheduleType,
  AvailabilityApi
} from '../services/availabilityApi';
import { CarApi, Car } from '../services/carApi';
import { DatePicker } from '../design_system/components/DatePicker';

const MaintenanceSchedule: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [cars, setCars] = useState<Car[]>([]);
  const [schedules, setSchedules] = useState<MaintenanceScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MaintenanceScheduleType | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    car_id: 0,
    maintenance_type: 'routine' as MaintenanceScheduleType['maintenance_type'],
    scheduled_date: '',
    estimated_duration_days: 1,
    description: '',
    cost: 0,
    status: 'scheduled' as MaintenanceScheduleType['status']
  });

  const loadCars = async () => {
    try {
      const response = await CarApi.getCars();
      setCars(response.cars);
      if (response.cars.length > 0 && !selectedCarId) {
        setSelectedCarId(response.cars[0].id);
      }
    } catch (error) {
      showError(t('maintenance.errors.loadCars'));
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const loadSchedules = async () => {
    if (!selectedCarId) return;
    setLoading(true);
    try {
      const schedules = await AvailabilityApi.getMaintenanceSchedules({
        car_id: selectedCarId
      });
      setSchedules(schedules);
    } catch (error) {
      showError(t('maintenance.errors.loadSchedules'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCarId) {
      loadSchedules();
    }
  }, [selectedCarId, loadSchedules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSchedule) {
        await AvailabilityApi.updateMaintenanceSchedule(editingSchedule.id, formData);
        showSuccess(t('maintenance.success.updated'));
      } else {
        await AvailabilityApi.createMaintenanceSchedule({
          ...formData,
          car_id: selectedCarId || 0
        });
        showSuccess(t('maintenance.success.created'));
      }
      setModalOpen(false);
      loadSchedules();
    } catch (error) {
      showError(t('maintenance.errors.save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (scheduleId: number, cost: number) => {
    try {
      await AvailabilityApi.completeMaintenanceSchedule(scheduleId, cost);
      showSuccess(t('maintenance.success.completed'));
      loadSchedules();
    } catch (error) {
      showError(t('maintenance.errors.complete'));
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
      maintenance_type: 'routine',
      scheduled_date: '',
      estimated_duration_days: 1,
      description: '',
      cost: 0,
      status: 'scheduled'
    });
    setEditingSchedule(null);
  };

  const handleCarChange = (value: string | string[]) => {
    const carId = Array.isArray(value) ? value[0] : value;
    setSelectedCarId(Number(carId));
  };
  
  const maintenanceTypeOptions = [
    { value: 'routine', label: t('maintenance.types.routine') },
    { value: 'repair', label: t('maintenance.types.repair') },
    { value: 'inspection', label: t('maintenance.types.inspection') },
    { value: 'upgrade', label: t('maintenance.types.upgrade') },
  ];

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
            {t('maintenance.title')}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('maintenance.subtitle')}
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
            {t('maintenance.addSchedule')}
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
            {t('maintenance.selectCar')}
          </h3>
          <Select
            value={selectedCarId?.toString() || ''}
            onValueChange={(value) => handleCarChange(value)}
            options={cars.map((car) => ({ value: car.id.toString(), label: `${car.brand_name} ${car.model_name} (${car.year})` }))}
            placeholder={t('maintenance.selectCar')}
          />
        </div>
      </div>

      {/* Maintenance Schedules Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('maintenance.table.date')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('maintenance.table.type')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('maintenance.table.duration')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('maintenance.table.status')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('maintenance.table.cost')}
                  </span>
                </th>
                <th className="px-6 py-4 text-start">
                  <span className="font-sakr font-medium text-sm text-on-surface-variant">
                    {t('maintenance.table.actions')}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-sakr font-medium text-on-surface">
                      {new Date(schedule.scheduled_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-sakr font-medium px-3 py-1 rounded-full text-sm ${
                      schedule.maintenance_type === 'routine' ? 'bg-success-100 text-success-700' :
                      schedule.maintenance_type === 'repair' ? 'bg-error-100 text-error-700' :
                      schedule.maintenance_type === 'inspection' ? 'bg-warning-100 text-warning-700' :
                      'bg-primary-100 text-primary-700'
                    }`}>
                      {t(`maintenance.types.${schedule.maintenance_type}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sakr font-medium text-on-surface">
                      {schedule.estimated_duration_days} {t('common.days')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-sakr font-medium px-3 py-1 rounded-full text-sm ${
                      schedule.status === 'completed' ? 'bg-success-100 text-success-700' :
                      schedule.status === 'in_progress' ? 'bg-warning-100 text-warning-700' :
                      schedule.status === 'cancelled' ? 'bg-error-100 text-error-700' :
                      'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {t(`maintenance.status.${schedule.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sakr font-medium text-on-surface">
                      {schedule.cost ? `${schedule.cost} KWD` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {schedule.status === 'scheduled' && (
                        <>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              setEditingSchedule(schedule);
                              setFormData({
                                car_id: schedule.car_id,
                                maintenance_type: schedule.maintenance_type,
                                scheduled_date: schedule.scheduled_date,
                                estimated_duration_days: schedule.estimated_duration_days,
                                description: schedule.description || '',
                                cost: schedule.cost || 0,
                                status: schedule.status
                              });
                              setModalOpen(true);
                            }}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            color="success"
                            onClick={() => {
                              const cost = window.prompt(t('maintenance.promptCost'));
                              if (cost !== null) {
                                handleComplete(schedule.id, parseFloat(cost));
                              }
                            }}
                          >
                            {t('maintenance.complete')}
                          </Button>
                        </>
                      )}
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
        title={editingSchedule ? t('maintenance.editSchedule') : t('maintenance.addSchedule')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DatePicker
            label={t('maintenance.form.date')}
            selected={formData.scheduled_date ? new Date(formData.scheduled_date) : null}
            onChange={(date) => setFormData({ ...formData, scheduled_date: date ? date.toISOString().split('T')[0] : '' })}
            fullWidth
            dateFormat="yyyy-MM-dd"
          />

          <Select
            value={formData.maintenance_type}
            onValueChange={(value) => setFormData({ ...formData, maintenance_type: value as MaintenanceScheduleType['maintenance_type'] })}
            options={maintenanceTypeOptions}
            placeholder={t('maintenance.form.type')}
          />

          <Input
            type="number"
            label={t('maintenance.form.duration')}
            value={formData.estimated_duration_days}
            onChange={(e) => setFormData({ ...formData, estimated_duration_days: parseInt(e.target.value) })}
            min={1}
            fullWidth
          />

          <Input
            label={t('maintenance.form.description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('maintenance.form.descriptionPlaceholder')}
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

export default MaintenanceSchedule;
