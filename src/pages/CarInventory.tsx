import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

const CarInventory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();

  // State management
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [carOptions, setCarOptions] = useState<CarOptions | null>(null);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);

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

  // Form component
  const CarForm = () => (
    <div className="space-y-6">
      {formErrors.length > 0 && (
        <div className="p-4 bg-md-sys-color-error-container text-md-sys-color-on-error-container rounded-lg">
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
          placeholder={!formData.brand_id ? t('cars.selectBrandFirst') : t('common.select')}
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

  const totalPages = Math.ceil(totalCars / pageSize);

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Top Navigation - Same as Dashboard */}
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
                icon={<Icon name={isRTL ? "arrow-left" : "arrow-right"} />}
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-md-sys-color-on-surface">
                {t('dashboard.carInventory')}
              </h1>
              <p className="text-md-sys-color-on-surface-variant">
                {t('dashboard.carInventoryDesc')}
              </p>
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
              />
            </div>
          </div>

          {/* Car List */}
          <div className="bg-md-sys-color-surface-container rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-md-sys-color-primary"></div>
                <p className="mt-2 text-md-sys-color-on-surface-variant">{t('common.loading')}...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="p-8 text-center text-md-sys-color-on-surface-variant">
                {searchTerm ? t('cars.noSearchResults') : t('cars.noCars')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-md-sys-color-surface-container-high">
                    <tr className="border-b border-md-sys-color-outline-variant">
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface">
                        {t('cars.brand')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface">
                        {t('cars.model')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface hidden sm:table-cell">
                        {t('cars.year')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface hidden md:table-cell">
                        {t('cars.seats')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface hidden lg:table-cell">
                        {t('cars.color')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface hidden lg:table-cell">
                        {t('cars.transmission')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface hidden xl:table-cell">
                        {t('cars.carType')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-md-sys-color-on-surface">
                        {t('cars.available')}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-md-sys-color-on-surface">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-md-sys-color-outline-variant">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-md-sys-color-surface-container-high transition-colors">
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface font-medium">
                          {car.brand_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface">
                          <div>
                            {car.model_name}
                            {car.trim_level && (
                              <div className="text-xs text-md-sys-color-on-surface-variant">
                                {car.trim_level}
                              </div>
                            )}
                            {/* Show additional info on mobile when columns are hidden */}
                            <div className="text-xs text-md-sys-color-on-surface-variant mt-1 sm:hidden">
                              {car.year} • {car.seats} seats
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface hidden sm:table-cell">
                          {car.year}
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface hidden md:table-cell">
                          {car.seats}
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-md-sys-color-outline"
                              style={{ backgroundColor: carOptions?.colors.find(c => c.id === car.color_id)?.hex_code || '#ccc' }}
                            />
                            {car.color_name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface hidden lg:table-cell">
                          {t(`cars.transmission.${car.transmission}`)}
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface hidden xl:table-cell">
                          {t(`cars.carType.${car.car_type}`)}
                        </td>
                        <td className="px-4 py-3 text-sm text-md-sys-color-on-surface">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            car.available_count > 0 
                              ? 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container' 
                              : 'bg-md-sys-color-error-container text-md-sys-color-on-error-container'
                          }`}>
                            {car.available_count}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openEditModal(car)}
                              className="text-xs sm:text-sm"
                            >
                              {t('common.edit')}
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openDeleteDialog(car)}
                              className="text-xs sm:text-sm"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outlined"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                {t('common.previous')}
              </Button>
              <span className="text-md-sys-color-on-surface-variant">
                {t('common.pageOfTotal', { current: currentPage, total: totalPages })}
              </span>
              <Button
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          )}

          {/* Add Modal */}
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title={t('cars.addNewCar')}
            size="large"
            actions={
              <>
                <Button variant="text" onClick={() => setIsAddModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSubmit} isLoading={isSubmitting}>
                  {t('common.add')}
                </Button>
              </>
            }
          >
            <CarForm />
          </Modal>

          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title={t('cars.editCar')}
            size="large"
            actions={
              <>
                <Button variant="text" onClick={() => setIsEditModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSubmit} isLoading={isSubmitting}>
                  {t('common.save')}
                </Button>
              </>
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
            message={t('cars.deleteConfirmation', {
              car: carToDelete ? formatCarDisplayName(carToDelete) : ''
            })}
            confirmText={t('common.delete')}
            variant="danger"
          />
        </div>
      </main>
    </div>
  );
};

export default CarInventory; 