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
import { Plus, Calendar, ChevronDown, CheckCircle } from 'lucide-react';
import { 
  QuarterlyPlan,
  AvailabilityApi
} from '../services/availabilityApi';
import { DatePicker } from '../design_system/components/DatePicker';

const QuarterlyPlanning: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // State
  const [plans, setPlans] = useState<QuarterlyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<QuarterlyPlan | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    quarter: 1,
    year: new Date().getFullYear(),
    target_utilization_rate: 80,
    maintenance_buffer_days: 7,
    status: 'draft' as QuarterlyPlan['status']
  });

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const plans = await AvailabilityApi.getQuarterlyPlans();
      setPlans(plans);
    } catch (error) {
      showError(t('quarterlyPlanning.errors.loadPlans'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingPlan) {
        await AvailabilityApi.updateQuarterlyPlan(editingPlan.id, formData);
        showSuccess(t('quarterlyPlanning.success.updated'));
      } else {
        await AvailabilityApi.createQuarterlyPlan(formData);
        showSuccess(t('quarterlyPlanning.success.created'));
      }
      setModalOpen(false);
      loadPlans();
    } catch (error) {
      showError(t('quarterlyPlanning.errors.save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async (planId: number) => {
    try {
      await AvailabilityApi.activateQuarterlyPlan(planId);
      showSuccess(t('quarterlyPlanning.success.activated'));
      loadPlans();
    } catch (error) {
      showError(t('quarterlyPlanning.errors.activate'));
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
      quarter: 1,
      year: new Date().getFullYear(),
      target_utilization_rate: 80,
      maintenance_buffer_days: 7,
      status: 'draft'
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan: QuarterlyPlan) => {
    setFormData({
      quarter: plan.quarter,
      year: plan.year,
      target_utilization_rate: plan.target_utilization_rate,
      maintenance_buffer_days: plan.maintenance_buffer_days,
      status: plan.status
    });
    setEditingPlan(plan);
    setModalOpen(true);
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
            {t('quarterlyPlanning.title')}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('quarterlyPlanning.subtitle')}
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
            {t('quarterlyPlanning.addPlan')}
          </Button>
        </div>
      </div>

      {/* Toast Messages */}
      {showToast && (
        <Alert variant={toastType === 'error' ? 'error' : 'success'}>
          {toastMessage}
        </Alert>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-surface rounded-2xl border border-outline-variant p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-sakr font-bold text-xl text-on-surface mb-1">
                  {t('quarterlyPlanning.quarterYear', { quarter: plan.quarter, year: plan.year })}
                </h3>
                <span className={`font-sakr font-medium px-3 py-1 rounded-full text-sm ${
                  plan.status === 'active' ? 'bg-success-100 text-success-700' :
                  plan.status === 'completed' ? 'bg-primary-100 text-primary-700' :
                  'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {t(`quarterlyPlanning.status.${plan.status}`)}
                </span>
              </div>
              {plan.status === 'draft' && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleActivate(plan.id)}
                >
                  <CheckCircle size={16} className="mr-2" />
                  {t('quarterlyPlanning.activate')}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-sakr font-medium text-sm text-on-surface-variant block mb-1">
                  {t('quarterlyPlanning.targetUtilization')}
                </label>
                <p className="font-sakr font-bold text-lg text-on-surface">
                  {plan.target_utilization_rate}%
                </p>
              </div>
              <div>
                <label className="font-sakr font-medium text-sm text-on-surface-variant block mb-1">
                  {t('quarterlyPlanning.maintenanceBuffer')}
                </label>
                <p className="font-sakr font-bold text-lg text-on-surface">
                  {plan.maintenance_buffer_days} {t('common.days')}
                </p>
              </div>
            </div>

            {plan.status === 'draft' && (
              <div className="mt-6 flex gap-2">
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleEdit(plan)}
                >
                  {t('common.edit')}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingPlan ? t('quarterlyPlanning.editPlan') : t('quarterlyPlanning.addPlan')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select.Root
              value={formData.quarter.toString()}
              onValueChange={(value) => setFormData({ ...formData, quarter: parseInt(value) })}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder={t('quarterlyPlanning.form.quarter')} />
              </Select.Trigger>
              <Select.Content>
                <Select.Viewport>
                  <Select.Item value="1">
                    <Select.ItemText>Q1</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="2">
                    <Select.ItemText>Q2</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="3">
                    <Select.ItemText>Q3</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="4">
                    <Select.ItemText>Q4</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Root>

            <Input
              type="number"
              label={t('quarterlyPlanning.form.year')}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              min={new Date().getFullYear()}
              fullWidth
            />
          </div>

          <Input
            type="number"
            label={t('quarterlyPlanning.form.targetUtilization')}
            value={formData.target_utilization_rate}
            onChange={(e) => setFormData({ ...formData, target_utilization_rate: parseInt(e.target.value) })}
            min={0}
            max={100}
            fullWidth
          />

          <Input
            type="number"
            label={t('quarterlyPlanning.form.maintenanceBuffer')}
            value={formData.maintenance_buffer_days}
            onChange={(e) => setFormData({ ...formData, maintenance_buffer_days: parseInt(e.target.value) })}
            min={1}
            max={30}
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

export default QuarterlyPlanning; 