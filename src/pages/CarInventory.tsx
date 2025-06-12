import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Button, 
  Input,
  Modal,
  ModalFooter,
  Select,
  SelectOption
} from '@mo_sami/web-design-system';
// import { PricingTable } from '../design_system/components/PricingTable';
import { useLanguage } from '../contexts/LanguageContext';
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
      console.error('Error loading models:', error);
      // Defensive: Reset to empty array on error
      setAvailableModels([]);
    }
  };

  // Convert data to SelectOption format
  const brandOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.brands.map(brand => ({
      value: brand.id.toString(),
      label: getLocalizedBrandName(brand, language),
      labelEn: brand.name_en,
      labelAr: brand.name_ar
    }));
  }, [carOptions, language]);

  const modelOptions: SelectOption[] = useMemo(() => {
    return availableModels.map(model => ({
      value: model.id.toString(),
      label: getLocalizedModelName(model, language),
      labelEn: model.name_en,
      labelAr: model.name_ar
    }));
  }, [availableModels, language]);

  const colorOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.colors.map(color => ({
      value: color.id.toString(),
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
        setIsEditModalOpen(false);
      } else {
        // Create new car
        await CarApiService.createCar(formData as CarFormData);
        setIsAddModalOpen(false);
        
        // Refresh inventory status to potentially enable navigation
        if (inventoryContext?.refreshStatus) {
          inventoryContext.refreshStatus();
        }
      }
      
      resetForm();
      loadCars(); // Refresh the list
    } catch (error) {
      console.error('Error saving car:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!carToDelete) return;

    setIsSubmitting(true);
    try {
      await CarApiService.deleteCar(carToDelete.id);
      setIsDeleteDialogOpen(false);
      setCarToDelete(null);
      loadCars(); // Refresh the list
      
      // Refresh inventory status in case this was the last car
      if (inventoryContext?.refreshStatus) {
        inventoryContext.refreshStatus();
      }
    } catch (error) {
      console.error('Error deleting car:', error);
    } finally {
      setIsSubmitting(false);
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
            value={formData.brand_id ? formData.brand_id.toString() : ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, brand_id: Number(value) || 0 }))}
            required
          />

          <Select
            label={t('cars.model')}
            options={modelOptions}
            value={formData.model_id ? formData.model_id.toString() : ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, model_id: Number(value) || 0 }))}
            disabled={!formData.brand_id || modelOptions.length === 0}
            placeholder={!formData.brand_id ? t('form.selectBrandFirst') : t('common.select')}
            required
          />

          <Input
            type="number"
            label={t('cars.year')}
            value={formData.year}
            onChange={(value) => setFormData(prev => ({ ...prev, year: Number(value) || 0 }))}
            min={1900}
            max={2030}
            required
          />

          <Input
            type="number"
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
            value={formData.color_id ? formData.color_id.toString() : ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, color_id: Number(value) || 0 }))}
            required
          />

          <Input
            label={t('cars.trimLevel')}
            value={formData.trim_level}
            onChange={(e) => setFormData(prev => ({ ...prev, trim_level: e.target.value }))}
            placeholder={t('cars.trimLevelPlaceholder')}
          />

          <Input
            type="number"
            label={t('cars.availableCount')}
            value={formData.available_count}
            onChange={(value) => setFormData(prev => ({ ...prev, available_count: Number(value) || 0 }))}
            min={0}
            required
          />

          <Select
            label={t('cars.transmission')}
            options={transmissionOptions}
            value={formData.transmission || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value as 'manual' | 'automatic' }))}
            required
          />

          <Select
            label={t('cars.carType')}
            options={carTypeOptions}
            value={formData.car_type || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, car_type: value as 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'pickup' | 'van' }))}
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
          <div>
            <p className="font-sakr font-medium text-base">
              {car.brand_name} {car.model_name}
            </p>
            <p className="font-sakr font-normal text-sm text-gray-600">
              {car.year} • {car.seats} seats • {car.color_name}
            </p>
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
          <p className="font-sakr font-normal text-sm text-gray-600">
            {t(`cars.transmission.${car.transmission}`)} • {t(`cars.carType.${car.car_type}`)}
          </p>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openEditModal(car)}
            className="w-8 h-8 p-0 hover:bg-primary-100 text-primary-600 hover:text-primary-700"
          >
            ✏️
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openDeleteDialog(car)} 
            className="w-8 h-8 p-0 hover:bg-error-100 text-error-600 hover:text-error-700"
          >
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );

  // Enhanced Empty State Component
  const EmptyInventoryState = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Icon/Illustration */}
        <div className="w-24 h-24 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <div className="text-4xl">🚗</div>
        </div>
        
        {/* Title */}
        <h3 className="font-sakr font-bold text-2xl mb-4 text-on-surface">
          {searchTerm ? t('empty.noSearchResults') : t('empty.noInventory')}
        </h3>
        
        {/* Description */}
        <p className="font-sakr font-normal text-lg text-on-surface-variant mb-8 leading-relaxed">
          {searchTerm ? t('empty.noSearchResultsDesc') : t('empty.noInventoryDesc')}
        </p>
        
        {/* Action Button */}
        <div className="space-y-4">
          {searchTerm ? (
            <Button variant="primary" size="lg" onClick={() => handleSearch('')}>
              {t('empty.clearFilters')}
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={openAddModal}>
              {t('empty.addFirstCar')}
            </Button>
          )}
        </div>
        
        {/* Optional Helper Text */}
        {!searchTerm && (
          <p className="font-sakr font-normal text-sm text-on-surface-variant mt-6">
            {t('empty.getStartedHint')}
          </p>
        )}
      </div>
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
          <p className="font-sakr font-normal text-base">
            {t('form.selectedItems', { count: selectedCars.size })}
          </p>
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
          <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
            {t('nav.inventory')}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('dashboard.carInventoryDesc')}
          </p>
        </div>
        <Button onClick={openAddModal}>
          {t('dashboard.addNewCar')}
        </Button>
      </div>

      {/* Search - Only show when inventory has cars */}
      {cars.length > 0 && (
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
      )}

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

        {/* Desktop Inventory Table */}
        <div className="hidden md:block">
          {loading ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 font-sakr font-normal text-text-secondary">{t('common.loading')}...</p>
            </div>
          ) : cars.length === 0 ? (
            <EmptyInventoryState />
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input 
                          type="checkbox" 
                          className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          checked={selectedCars.size === cars.length && cars.length > 0}
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.brand')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.model')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.year')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.seats')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.color')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.transmission')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.carType')}
                      </th>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary">
                        {t('cars.availableCount')}
                      </th>
                      <th className="px-4 py-3 text-right font-sakr font-medium text-sm text-text-primary">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-neutral-25 transition-colors">
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                            checked={selectedCars.has(car.id)}
                            onChange={(e) => handleSelectCar(car.id, e.target.checked)}
                          />
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-primary">
                          {car.brand_name}
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-primary">
                          {car.model_name}
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-secondary">
                          {car.year}
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-secondary">
                          {car.seats}
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-secondary">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-neutral-300" 
                              style={{ backgroundColor: car.color_name === 'White' ? '#ffffff' : 
                                       car.color_name === 'Black' ? '#000000' : 
                                       car.color_name === 'Red' ? '#ef4444' :
                                       car.color_name === 'Blue' ? '#3b82f6' :
                                       car.color_name === 'Gray' ? '#6b7280' :
                                       car.color_name === 'Silver' ? '#d1d5db' : '#9ca3af' }}
                            />
                            {car.color_name}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-secondary">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                            {t(`cars.transmission.${car.transmission}`)}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm text-text-secondary">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                            {t(`cars.carType.${car.car_type}`)}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-sakr font-normal text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            car.available_count > 0 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {car.available_count}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditModal(car)}
                              className="w-8 h-8 p-0 hover:bg-primary-100 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                            >
                              ✏️
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openDeleteDialog(car)} 
                              className="w-8 h-8 p-0 hover:bg-error-100 text-error-600 hover:text-error-700 transition-colors duration-200"
                            >
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <p className="font-sakr font-normal text-sm text-gray-600">
            {t('common.pageOfTotal', { current: currentPage, total: totalPages })}
          </p>
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
        open={isAddModalOpen}
        onOpenChange={(open) => setIsAddModalOpen(open)}
        title={t('cars.addNewCar')}
        size="lg"
      >
        <CarForm />
        <ModalFooter>
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
        </ModalFooter>
      </Modal>

      {/* Edit Car Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={(open) => setIsEditModalOpen(open)}
        title={t('cars.editCar')}
        size="lg"
      >
        <CarForm />
        <ModalFooter>
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
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        title={t('cars.deleteCar')}
        size="md"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-error-600">⚠️</span>
            </div>
            <div>
              <h3 className="font-sakr font-bold text-lg text-on-surface mb-2">
                {t('cars.deleteConfirmTitle')}
              </h3>
              <p className="font-sakr font-normal text-sm text-on-surface-variant leading-relaxed">
                {carToDelete && (
                  <>
                    {t('cars.deleteConfirmMessage', {
                      carName: `${carToDelete.brand_name} ${carToDelete.model_name}`,
                      year: carToDelete.year
                    })}{' '}
                    {t('cars.deleteWarning')}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="primary"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="!bg-red-600 hover:!bg-red-700 !text-white !border-red-600 hover:!border-red-700"
            >
              {isSubmitting ? t('common.loading') : t('common.delete')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CarInventory; 