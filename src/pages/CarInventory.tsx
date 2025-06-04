import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Button, 
  Input, 
  Select, 
  NumberInput, 
  Modal, 
  ConfirmDialog,
  useSuccessToast,
  useErrorToast,
  SelectOption,
  Typography,
  Icon
} from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { clearAuthToken } from '../services/api';
import {
  CarApiService,
  Car,
  CarFormData,
  CarOptions,
  Brand,
  Model,
  Color,
  DropdownOption,
  getLocalizedBrandName,
  getLocalizedModelName,
  getLocalizedColorName,
  getLocalizedDropdownLabel,
  validateCarForm,
  formatCarDisplayName
} from '../services/carApi';

// Inventory context type from DashboardLayout
interface InventoryContext {
  isEmpty: boolean;
  isLoading: boolean;
  refreshStatus: () => void;
}

const CarInventory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  
  // Get inventory context from outlet
  const inventoryContext = useOutletContext<InventoryContext>();

  // State management
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [carOptions, setCarOptions] = useState<CarOptions | null>(null);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedCars, setSelectedCars] = useState<Set<number>>(new Set());

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CarFormData>>({
    brand_id: 0,
    model_id: 0,
    year: new Date().getFullYear(),
    seats: 5,
    color_id: 0,
    trim_level: '',
    available_count: 1,
    transmission: 'automatic',
    car_type: 'sedan'
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  // Load initial data
  useEffect(() => {
    loadCars();
    loadCarOptions();
  }, [currentPage, searchTerm]);

  // Load models when brand changes
  useEffect(() => {
    if (formData.brand_id && formData.brand_id > 0) {
      loadModelsForBrand(formData.brand_id);
    } else {
      setAvailableModels([]);
      setFormData(prev => ({ ...prev, model_id: 0 }));
    }
  }, [formData.brand_id]);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await CarApiService.getCars({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        search: searchTerm || undefined
      });
      setCars(response.cars || []);
      setTotalCars(response.total || 0);
      setSelectedCars(new Set()); // Clear selection when loading new data
    } catch (error) {
      showError('Failed to load cars');
      console.error('Error loading cars:', error);
      setCars([]);
      setTotalCars(0);
    } finally {
      setLoading(false);
    }
  };

  const loadCarOptions = async () => {
    try {
      const response = await CarApiService.getCarOptions();
      // Defensive: Ensure all nested arrays exist
      const options = response.options || {};
      setCarOptions({
        brands: options.brands || [],
        colors: options.colors || [],
        transmissions: options.transmissions || [],
        car_types: options.car_types || []
      });
    } catch (error) {
      showError('Failed to load car options');
      console.error('Error loading car options:', error);
      // Defensive: Reset to empty structure on error
      setCarOptions({
        brands: [],
        colors: [],
        transmissions: [],
        car_types: []
      });
    }
  };

  const loadModelsForBrand = async (brandId: number) => {
    try {
      const response = await CarApiService.getModelsByBrand(brandId);
      // Defensive: Ensure models is always an array
      setAvailableModels(response.models || []);
    } catch (error) {
      showError('Failed to load models');
      console.error('Error loading models:', error);
      // Defensive: Reset to empty array on error
      setAvailableModels([]);
    }
  };

  // Convert data to SelectOption format
  const brandOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.brands.map(brand => ({
      value: brand.id,
      label: getLocalizedBrandName(brand, language),
      labelEn: brand.name_en,
      labelAr: brand.name_ar
    }));
  }, [carOptions, language]);

  const modelOptions: SelectOption[] = useMemo(() => {
    return availableModels.map(model => ({
      value: model.id,
      label: getLocalizedModelName(model, language),
      labelEn: model.name_en,
      labelAr: model.name_ar
    }));
  }, [availableModels, language]);

  const colorOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.colors.map(color => ({
      value: color.id,
      label: getLocalizedColorName(color, language),
      labelEn: color.name_en,
      labelAr: color.name_ar
    }));
  }, [carOptions, language]);

  const transmissionOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.transmissions.map(transmission => ({
      value: transmission.value,
      label: getLocalizedDropdownLabel(transmission, language),
      labelEn: transmission.label_en,
      labelAr: transmission.label_ar
    }));
  }, [carOptions, language]);

  const carTypeOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.car_types.map(carType => ({
      value: carType.value,
      label: getLocalizedDropdownLabel(carType, language),
      labelEn: carType.label_en,
      labelAr: carType.label_ar
    }));
  }, [carOptions, language]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle bulk selection
  const handleSelectCar = (carId: number, checked: boolean) => {
    const newSelected = new Set(selectedCars);
    if (checked) {
      newSelected.add(carId);
    } else {
      newSelected.delete(carId);
    }
    setSelectedCars(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(new Set(cars.map(car => car.id)));
    } else {
      setSelectedCars(new Set());
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateCarForm(formData);
    setFormErrors(errors);

    if (errors.length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCar) {
        // Update existing car
        await CarApiService.updateCar(editingCar.id, formData as CarFormData);
        showSuccess('Car updated successfully');
        setIsEditModalOpen(false);
      } else {
        // Create new car
        await CarApiService.createCar(formData as CarFormData);
        showSuccess('Car added successfully');
        setIsAddModalOpen(false);
        
        // Refresh inventory status to potentially enable navigation
        if (inventoryContext?.refreshStatus) {
          inventoryContext.refreshStatus();
        }
      }
      
      resetForm();
      loadCars(); // Refresh the list
    } catch (error) {
      showError('Failed to save car');
      console.error('Error saving car:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!carToDelete) return;

    try {
      await CarApiService.deleteCar(carToDelete.id);
      showSuccess('Car deleted successfully');
      setIsDeleteDialogOpen(false);
      setCarToDelete(null);
      loadCars(); // Refresh the list
      
      // Refresh inventory status in case this was the last car
      if (inventoryContext?.refreshStatus) {
        inventoryContext.refreshStatus();
      }
    } catch (error) {
      showError('Failed to delete car');
      console.error('Error deleting car:', error);
    }
  };

  // Form helpers
  const resetForm = () => {
    setFormData({
      brand_id: 0,
      model_id: 0,
      year: new Date().getFullYear(),
      seats: 5,
      color_id: 0,
      trim_level: '',
      available_count: 1,
      transmission: 'automatic',
      car_type: 'sedan'
    });
    setFormErrors([]);
    setEditingCar(null);
    setAvailableModels([]);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setFormData({
      brand_id: car.brand_id,
      model_id: car.model_id,
      year: car.year,
      seats: car.seats,
      color_id: car.color_id,
      trim_level: car.trim_level,
      available_count: car.available_count,
      transmission: car.transmission,
      car_type: car.car_type
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const handleFormDataChange = (newData: Partial<CarFormData>) => {
    setFormData(newData);
  };

  // Original single-step form component
  const CarForm = () => {
    return (
      <div className="space-y-6">
        {formErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <ul className="list-disc list-inside space-y-1">
              {formErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <Select
            label={t('cars.brand')}
            options={brandOptions}
            value={formData.brand_id}
            onChange={(value) => setFormData(prev => ({ ...prev, brand_id: Number(value) }))}
            required
          />

          <Select
            label={t('cars.model')}
            options={modelOptions}
            value={formData.model_id}
            onChange={(value) => setFormData(prev => ({ ...prev, model_id: Number(value) }))}
            disabled={!formData.brand_id || modelOptions.length === 0}
            placeholder={!formData.brand_id ? t('form.selectBrandFirst') : t('common.select')}
            required
          />

          <NumberInput
            label={t('cars.year')}
            value={formData.year}
            onChange={(value) => setFormData(prev => ({ ...prev, year: Number(value) || 0 }))}
            min={1900}
            max={2030}
            required
          />

          <NumberInput
            label={t('cars.seats')}
            value={formData.seats}
            onChange={(value) => setFormData(prev => ({ ...prev, seats: Number(value) || 0 }))}
            min={1}
            max={12}
            required
          />

          <Select
            label={t('cars.color')}
            options={colorOptions}
            value={formData.color_id}
            onChange={(value) => setFormData(prev => ({ ...prev, color_id: Number(value) }))}
            required
          />

          <Input
            label={t('cars.trimLevel')}
            value={formData.trim_level}
            onChange={(e) => setFormData(prev => ({ ...prev, trim_level: e.target.value }))}
            placeholder={t('cars.trimLevelPlaceholder')}
          />

          <NumberInput
            label={t('cars.availableCount')}
            value={formData.available_count}
            onChange={(value) => setFormData(prev => ({ ...prev, available_count: Number(value) || 0 }))}
            min={0}
            required
          />

          <Select
            label={t('cars.transmission')}
            options={transmissionOptions}
            value={formData.transmission}
            onChange={(value) => setFormData(prev => ({ ...prev, transmission: value as any }))}
            required
          />

          <Select
            label={t('cars.carType')}
            options={carTypeOptions}
            value={formData.car_type}
            onChange={(value) => setFormData(prev => ({ ...prev, car_type: value as any }))}
            required
          />
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const CarCard = ({ car }: { car: Car }) => (
    <div className="bg-surface rounded-lg border border-outline-variant p-4 md:hidden space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="user" size="small" className="text-primary-600" />
          </div>
          <div>
            <Typography variant="body-medium" className="font-medium">
              {car.brand_name} {car.model_name}
            </Typography>
            <Typography variant="body-small" color="on-surface-variant">
              {car.year} • {car.seats} seats • {car.color_name}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            car.available_count > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {car.available_count}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
        <div className="flex gap-2">
          <Typography variant="body-small" color="on-surface-variant">
            {t(`cars.transmission.${car.transmission}`)} • {t(`cars.carType.${car.car_type}`)}
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button variant="text" size="small" onClick={() => openEditModal(car)}>
            {t('common.edit')}
          </Button>
          <Button variant="text" size="small" onClick={() => openDeleteDialog(car)} className="text-error">
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </div>
  );

  // Enhanced Empty State Component
  const EmptyInventoryState = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="user" size="large" className="text-primary-600" />
      </div>
      <Typography variant="headline-small" className="mb-2">
        {searchTerm ? t('empty.noSearchResults') : t('empty.noInventory')}
      </Typography>
      <Typography variant="body-medium" color="on-surface-variant" className="mb-6 max-w-md mx-auto">
        {searchTerm ? t('empty.noSearchResultsDesc') : t('empty.noInventoryDesc')}
      </Typography>
      {searchTerm ? (
        <Button variant="outlined" onClick={() => handleSearch('')}>
          {t('empty.clearFilters')}
        </Button>
      ) : (
        <Button onClick={openAddModal}>
          {t('empty.addFirstCar')}
        </Button>
      )}
    </div>
  );

  // Bulk Actions Bar
  const BulkActionsBar = () => {
    if (selectedCars.size === 0) {
      return null;
    }

    return (
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Typography variant="body-medium">
            {t('form.selectedItems', { count: selectedCars.size })}
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="small">
              {t('form.bulkEdit')}
            </Button>
            <Button variant="outlined" size="small" className="text-error">
              {t('form.deleteSelected')}
            </Button>
            <Button variant="text" size="small" onClick={() => setSelectedCars(new Set())}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const totalPages = Math.ceil(totalCars / pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <Typography variant="headline-medium" color="on-surface" className="font-bold mb-2">
            {t('nav.inventory')}
          </Typography>
          <Typography variant="body-large" color="on-surface-variant">
            {t('dashboard.carInventoryDesc')}
          </Typography>
        </div>
        <Button onClick={openAddModal}>
          {t('dashboard.addNewCar')}
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder={t('cars.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            data-tour="search"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar />

      {/* Car List */}
      <div className="space-y-4">
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface rounded-lg border border-outline-variant p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-outline rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-outline rounded w-3/4"></div>
                      <div className="h-3 bg-outline rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <EmptyInventoryState />
          ) : (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          )}
        </div>

        {/* Desktop Table */}
        <div className="bg-surface rounded-lg border border-outline-variant overflow-hidden hidden md:block">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-on-surface-variant">{t('common.loading')}...</p>
            </div>
          ) : cars.length === 0 ? (
            <EmptyInventoryState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-surface-container-high">
                  <tr className="border-b border-outline-variant">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCars.size === cars.length && cars.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-outline-variant"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-on-surface">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-on-surface hidden sm:table-cell">
                      {t('cars.year')}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-on-surface hidden md:table-cell">
                      {t('cars.seats')}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-on-surface hidden lg:table-cell">
                      {t('cars.transmission')}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-on-surface">
                      {t('cars.available')}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-on-surface">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-surface-container-highest group transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCars.has(car.id)}
                          onChange={(e) => handleSelectCar(car.id, e.target.checked)}
                          className="rounded border-outline-variant"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                            <Icon name="user" size="small" className="text-primary-600" />
                          </div>
                          <div>
                            <Typography variant="body-medium" className="font-medium">
                              {car.brand_name} {car.model_name}
                            </Typography>
                            <Typography variant="body-small" color="on-surface-variant">
                              {car.color_name} • {t(`cars.carType.${car.car_type}`)}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface-variant hidden sm:table-cell">
                        {car.year}
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface-variant hidden md:table-cell">
                        {car.seats}
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface-variant hidden lg:table-cell">
                        {t(`cars.transmission.${car.transmission}`)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          car.available_count > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {car.available_count} available
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => openEditModal(car)}
                            className="hover:bg-blue-50"
                          >
                            {t('form.quickEdit')}
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => openDeleteDialog(car)}
                            className="text-error hover:bg-red-50"
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
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Typography variant="body-small" color="on-surface-variant">
            {t('common.pageOfTotal', { current: currentPage, total: totalPages })}
          </Typography>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Add Car Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t('cars.addNewCar')}
        size="large"
        actions={
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setIsAddModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        }
      >
        <CarForm />
      </Modal>

      {/* Edit Car Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t('cars.editCar')}
        size="large"
        actions={
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setIsEditModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        }
      >
        <CarForm />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t('cars.deleteCar')}
        message={carToDelete ? t('cars.deleteConfirmation', { 
          car: formatCarDisplayName(carToDelete, language) 
        }) : ''}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      />
    </div>
  );
};

export default CarInventory; 