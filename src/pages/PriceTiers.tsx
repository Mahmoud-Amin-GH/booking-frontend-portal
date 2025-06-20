import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Button,
  Input,
  Modal,
  ModalFooter,
  Alert
} from '@mo_sami/web-design-system';
import { Trash2, Edit, Plus, RotateCcw } from 'lucide-react';
import {
  PriceTier,
  PriceTierFormData,
  getPriceTiers,
  createPriceTier,
  updatePriceTier,
  deletePriceTier,
  resetPriceTiersToDefaults
} from '../services/priceTiersApi';
import { useLanguage } from '../contexts/LanguageContext';

export const PriceTiers: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<PriceTier | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const { isRTL } = useLanguage();

  // Form state
  const [formData, setFormData] = useState<PriceTierFormData>({
    tier_name: '',
    days_from: 1,
    days_to: null,
    multiplier: 1.0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load tiers on component mount
  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      setLoading(true);
      const response = await getPriceTiers();
      setTiers(response);
    } catch (error) {
      console.error('Error loading price tiers:', error);
      showToastMessage(t('priceTiers.errors.loadFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetForm = () => {
    setFormData({
      tier_name: '',
      days_from: 1,
      days_to: null,
      multiplier: 1.0
    });
    setFormErrors({});
    setEditingTier(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.tier_name.trim()) {
      errors.tier_name = t('priceTiers.errors.tierNameRequired');
    }

    if (!formData.days_from || formData.days_from <= 0) {
      errors.days_from = t('priceTiers.errors.minDaysPositive');
    }

    if (formData.days_to !== null && formData.days_to !== undefined && formData.days_to <= formData.days_from) {
      errors.days_to = t('priceTiers.errors.maxDaysGreater');
    }

    if (!formData.multiplier || formData.multiplier <= 0) {
      errors.multiplier = t('priceTiers.errors.multiplierPositive');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingTier) {
        await updatePriceTier(editingTier.id, formData);
        showToastMessage(t('priceTiers.success.updated'), 'success');
      } else {
        await createPriceTier(formData);
        showToastMessage(t('priceTiers.success.created'), 'success');
      }
      setModalOpen(false);
      resetForm();
      loadTiers();
    } catch (error) {
      console.error('Error saving tier:', error);
      const errorMessage = editingTier 
        ? t('priceTiers.errors.updateFailed')
        : t('priceTiers.errors.createFailed');
      showToastMessage(errorMessage, 'error');
    }
  };

  const handleEdit = (tier: PriceTier) => {
    setEditingTier(tier);
    setFormData({
      tier_name: tier.tier_name,
      days_from: tier.days_from,
      days_to: tier.days_to,
      multiplier: tier.multiplier
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!tierToDelete) return;

    try {
      await deletePriceTier(tierToDelete.id);
      showToastMessage(t('priceTiers.success.deleted'), 'success');
      setDeleteConfirmOpen(false);
      setTierToDelete(null);
      loadTiers();
    } catch (error) {
      console.error('Error deleting tier:', error);
      showToastMessage(t('priceTiers.errors.deleteFailed'), 'error');
    }
  };

  const handleResetToDefaults = async () => {
    try {
      await resetPriceTiersToDefaults();
      showToastMessage(t('priceTiers.success.reset'), 'success');
      setResetConfirmOpen(false);
      loadTiers();
    } catch (error) {
      console.error('Error resetting tiers:', error);
      showToastMessage(t('priceTiers.errors.resetFailed'), 'error');
    }
  };

  const formatDayRange = (tier: PriceTier): string => {
    if (tier.days_to === null) {
      return t('priceTiers.dayRangeUnlimited', { min: tier.days_from });
    }
    return t('priceTiers.dayRange', { min: tier.days_from, max: tier.days_to });
  };

  const formatTierName = (tierName: string): string => {
    // Check if it's one of the default tier names that should be translated
    const tierNameMap: Record<string, string> = {
      '1-7 Days': 'priceTiers.tierNames.1to7Days',
      '8-30 Days': 'priceTiers.tierNames.8to30Days', 
      '31-90 Days': 'priceTiers.tierNames.31to90Days',
      '90+ Days': 'priceTiers.tierNames.90plusDays'
    };

    // If it's a standard tier name, translate it
    if (tierNameMap[tierName]) {
      return t(tierNameMap[tierName]);
    }

    // Otherwise, return the custom tier name as-is
    return tierName;
  };

  const formatDiscount = (multiplier: number): string => {
    const discount = Math.round((1 - multiplier) * 100);
    return discount > 0 ? `-${discount}%` : '0%';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 font-sakr font-normal text-text-secondary">{t('common.loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header - Match CarInventory structure exactly */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
            {t('priceTiers.title')}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('priceTiers.subtitle')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outlined"
            onClick={() => setResetConfirmOpen(true)}
          >
            <RotateCcw size={16} className="mr-2" />
            {t('priceTiers.resetDefaults')}
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            {t('priceTiers.addNew')}
          </Button>
        </div>
      </div>

      {/* Toast Messages */}
      {showToast && (
        <Alert variant={toastType === 'error' ? 'error' : 'success'}>
          {toastMessage}
        </Alert>
      )}

      {/* Tiers Table - Match CarInventory table structure exactly */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    {t('priceTiers.table.tierName')}
                  </th>
                  <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    {t('priceTiers.table.dayRange')}
                  </th>
                  <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    {t('priceTiers.table.multiplier')}
                  </th>
                  <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    {t('priceTiers.table.discount')}
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {tiers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-center">
                        <p className="font-sakr font-medium text-lg text-gray-500">
                          {t('priceTiers.noTiers')}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-neutral-25 transition-colors">
                      <td className="px-4 py-4 font-sakr font-medium text-sm text-text-primary">
                        {formatTierName(tier.tier_name)}
                      </td>
                      <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                        {formatDayRange(tier)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                          {tier.multiplier.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tier.multiplier < 1 ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {formatDiscount(tier.multiplier)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleEdit(tier)}
                          >
                            <Edit size={14} className="mr-1" />
                            {t('priceTiers.table.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => {
                              setTierToDelete(tier);
                              setDeleteConfirmOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} className="mr-1" />
                            {t('priceTiers.table.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
        title={editingTier ? t('priceTiers.form.edit') : t('priceTiers.addNew')}
        size="lg"
      >
        <div className="space-y-6 pb-4">
          <div>
            <label className="block font-sakr font-medium text-sm text-gray-700 mb-2">
              {t('priceTiers.form.tierName')}
            </label>
            <Input
              value={formData.tier_name}
              onChange={(e) => setFormData({ ...formData, tier_name: e.target.value })}
              placeholder={t('priceTiers.form.tierNamePlaceholder')}
              error={formErrors.tier_name}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-sakr font-medium text-sm text-gray-700 mb-2">
                {t('priceTiers.form.minDays')}
              </label>
              <Input
                type="number"
                min="1"
                value={formData.days_from.toString()}
                onChange={(e) => setFormData({ ...formData, days_from: parseInt(e.target.value) || 1 })}
                error={formErrors.days_from}
              />
            </div>

            <div>
              <label className="block font-sakr font-medium text-sm text-gray-700 mb-2">
                {t('priceTiers.form.maxDays')}
              </label>
              <Input
                type="number"
                min="1"
                value={formData.days_to?.toString() || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  days_to: e.target.value ? parseInt(e.target.value) : null 
                })}
                placeholder={t('priceTiers.form.maxDaysUnlimited')}
                error={formErrors.max_days}
              />
            </div>
          </div>

          <div>
            <label className="block font-sakr font-medium text-sm text-gray-700 mb-2">
              {t('priceTiers.form.multiplier')}
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max="2.00"
              value={formData.multiplier.toString()}
              onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) || 1.0 })}
              error={formErrors.multiplier}
            />
            <p className="font-sakr text-sm text-gray-500 mt-2">
              {t('priceTiers.form.multiplierHelp')}
            </p>
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button
              variant="text"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              {t('priceTiers.form.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {t('priceTiers.form.save')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t('priceTiers.confirmDeleteTitle')}
        size="md"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-error-600">⚠️</span>
            </div>
            <div>
              <h3 className="font-sakr font-bold text-lg text-on-surface mb-2">
                {t('priceTiers.table.confirmDelete')}
              </h3>
              {tierToDelete && (
                <p className="font-sakr font-medium text-lg text-on-surface mt-3">
                  "{tierToDelete.tier_name}"
                </p>
              )}
            </div>
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button
              variant="text"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              {t('priceTiers.form.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              {t('priceTiers.table.delete')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title={t('priceTiers.confirmResetTitle')}
        size="md"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-warning-600">🔄</span>
            </div>
            <div>
              <h3 className="font-sakr font-bold text-lg text-on-surface mb-2">
                {t('priceTiers.confirmReset')}
              </h3>
            </div>
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button
              variant="text"
              onClick={() => setResetConfirmOpen(false)}
            >
              {t('priceTiers.form.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetToDefaults}
            >
              {t('priceTiers.resetDefaults')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}; 