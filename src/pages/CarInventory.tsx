import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { 
  Button, 
  Input,
  Modal,
  ModalFooter,
  Alert
} from '@mo_sami/web-design-system';
import * as Select from '@radix-ui/react-select';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  formatCarDisplayName,
  TieredPrice,
  BulkUploadResult
} from '../services/carApi';
import { PriceTier, getPriceTiers } from '../services/priceTiersApi';
import { useInventoryStatus } from '../hooks/useInventoryStatus';
import BulkCarUpload from '../components/BulkCarUpload';

// Inventory context type from DashboardLayout
interface InventoryContext {
  isEmpty: boolean;
  isLoading: boolean;
  refreshStatus: () => void;
}

// Add rental type enum
export enum RentalType {
  Daily = 'daily',
  LongTerm = 'long_term',
  Leasing = 'leasing'
}

interface SelectOption {
  value: string;
  label: string;
  labelEn: string;
  labelAr: string;
}

const CarInventory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, isRTL } = useLanguage();
  
  // Get inventory context from outlet
  const inventoryContext = useOutletContext<InventoryContext>();

  // Determine rental type from URL
  const rentalType = useMemo(() => {
    const path = location.pathname;
    if (path.endsWith('/daily')) return RentalType.Daily;
    if (path.endsWith('/long-term')) return RentalType.LongTerm;
    if (path.endsWith('/leasing')) return RentalType.Leasing;
    return RentalType.Daily; // No specific rental type (all cars)
  }, [location.pathname]);

  // State management
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [carOptions, setCarOptions] = useState<CarOptions | null>(null);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedCars, setSelectedCars] = useState<Set<number>>(new Set());
  const [userPriceTiers, setUserPriceTiers] = useState<PriceTier[]>([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // Bulk upload state
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CarFormData>>({
    brand_id: 0,
    model_id: 0,
    year: new Date().getFullYear(),
    color_id: 0,
    trim_level: '',
    available_count: 1,
    transmission: 'automatic',
    rental_type: (() => {
      // Convert URL format to API format for rental type
      if (rentalType === RentalType.Daily) return 'daily';
      if (rentalType === RentalType.LongTerm) return 'long_term';
      if (rentalType === RentalType.Leasing) return 'leasing';
      return 'daily';
    })(),
    price_per_day: 0,
    allowed_kilometers: 250,
    // New pricing fields
    downpayment: 0,
    months_36_price: 0,
    months_48_price: 0,
    final_payment: 0
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  // Load initial data
  useEffect(() => {
    loadCars();
    loadCarOptions();
    if (rentalType === RentalType.Daily) {
      loadUserPriceTiers();
    }
  }, [currentPage, searchTerm, rentalType]);

  // Load models when brand changes
  useEffect(() => {
    if (formData.brand_id && formData.brand_id > 0) {
      loadModelsForBrand(formData.brand_id);
    } else {
      setAvailableModels([]);
      setFormData(prev => ({ ...prev, model_id: 0 }));
    }
  }, [formData.brand_id]);

  // Update form rental type when route changes
  useEffect(() => {
    const defaultRentalType = (() => {
      if (rentalType === RentalType.Daily) return 'daily';
      if (rentalType === RentalType.LongTerm) return 'long_term';
      if (rentalType === RentalType.Leasing) return 'leasing';
      return 'daily';
    })();
    
    setFormData(prev => ({ ...prev, rental_type: defaultRentalType }));
  }, [rentalType]);

  const loadCars = async () => {
    try {
      setLoading(true);
      // Convert URL format to API format for rental type
      let apiRentalType: string | undefined = undefined;
      if (rentalType === RentalType.Daily) apiRentalType = 'daily';
      if (rentalType === RentalType.LongTerm) apiRentalType = 'long_term';
      if (rentalType === RentalType.Leasing) apiRentalType = 'leasing';
      
      const requestParams = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        search: searchTerm || undefined,
        rentalType: apiRentalType
      };
      
      const response = await CarApiService.getCars(requestParams);
      
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
        car_types: options.car_types || [],
        trim_levels: options.trim_levels || []
      });
    } catch (error) {
      console.error('Error loading car options:', error);
      // Defensive: Reset to empty structure on error
      setCarOptions({
        brands: [],
        colors: [],
        transmissions: [],
        car_types: [],
        trim_levels: []
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

  const loadUserPriceTiers = async () => {
    try {
      const tiers = await getPriceTiers();
      setUserPriceTiers(tiers);
    } catch (error) {
      console.error('Error loading price tiers:', error);
      setUserPriceTiers([]);
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

  const trimLevelOptions: SelectOption[] = useMemo(() => {
    if (!carOptions) return [];
    return carOptions.trim_levels?.map(trim => ({
      value: trim.value,
      label: getLocalizedDropdownLabel(trim, language),
      labelEn: trim.label_en,
      labelAr: trim.label_ar
    })) || [];
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
    // Convert URL format to API format for rental type
    let defaultRentalType: 'daily' | 'long_term' | 'leasing' = 'daily';
    if (rentalType === RentalType.Daily) defaultRentalType = 'daily';
    if (rentalType === RentalType.LongTerm) defaultRentalType = 'long_term';
    if (rentalType === RentalType.Leasing) defaultRentalType = 'leasing';
    
    setFormData({
      brand_id: 0,
      model_id: 0,
      year: new Date().getFullYear(),
      color_id: 0,
      trim_level: '',
      available_count: 1,
      transmission: 'automatic',
      rental_type: defaultRentalType,
      price_per_day: 0,
      allowed_kilometers: 250,
      // New pricing fields
      downpayment: 0,
      months_36_price: 0,
      months_48_price: 0,
      final_payment: 0
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
      color_id: car.color_id,
      trim_level: car.trim_level,
      available_count: car.available_count,
      transmission: car.transmission,
      rental_type: car.rental_type,
      price_per_day: car.price_per_day,
      allowed_kilometers: car.allowed_kilometers,
      // New pricing fields
      downpayment: car.downpayment,
      months_36_price: car.months_36_price,
      months_48_price: car.months_48_price,
      final_payment: car.final_payment
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

  // Handle bulk upload completion
  const handleBulkUploadComplete = () => {
    // Refresh the car list to show newly uploaded cars
    loadCars();
    
    // Refresh inventory status if available
    if (inventoryContext?.refreshStatus) {
      inventoryContext.refreshStatus();
    }
  };

  // Original single-step form component
  const CarForm = () => {
    return (
      <div className="space-y-6 pb-4">
        {formErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <ul className="list-disc list-inside space-y-1">
              {formErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Car Specs Section */}
        <div>
          <h3 className="font-sakr font-medium text-lg text-gray-900 mb-4">
            {t('form.carSpecs')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.brand')} <span className="text-red-500">*</span>
              </label>
              <Select.Root
                value={formData.brand_id ? formData.brand_id.toString() : ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, brand_id: Number(value) || 0 }))}
              >
                <Select.Trigger className="w-full">
                  <Select.Value placeholder={t('cars.brand')} />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {brandOptions.map(option => (
                      <Select.Item key={option.value} value={option.value}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.model')} <span className="text-red-500">*</span>
              </label>
              <Select.Root
                value={formData.model_id ? formData.model_id.toString() : ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, model_id: Number(value) || 0 }))}
                disabled={!formData.brand_id || modelOptions.length === 0}
              >
                <Select.Trigger className="w-full">
                  <Select.Value placeholder={!formData.brand_id ? t('form.selectBrandFirst') : t('common.select')} />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {modelOptions.map(option => (
                      <Select.Item key={option.value} value={option.value}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>

            <Input
              type="number"
              label={t('cars.year')}
              value={formData.year ?? ''}
              onChange={e => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, year: value === '' ? 0 : Number(value) }));
              }}
              min={1900}
              max={2030}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.trimLevel')} <span className="text-red-500">*</span>
              </label>
              <Select.Root
                value={typeof formData.trim_level === 'string' ? formData.trim_level : (Array.isArray(formData.trim_level) ? formData.trim_level[0] : '')}
                onValueChange={(value) => setFormData(prev => ({ ...prev, trim_level: String(value) }))}
              >
                <Select.Trigger className="w-full">
                  <Select.Value placeholder={t('cars.trimLevel')} />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {trimLevelOptions.map(option => (
                      <Select.Item key={option.value} value={option.value}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.transmission')} <span className="text-red-500">*</span>
              </label>
              <Select.Root
                value={formData.transmission || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value as 'manual' | 'automatic' }))}
              >
                <Select.Trigger className="w-full">
                  <Select.Value placeholder={t('cars.transmission')} />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {transmissionOptions.map(option => (
                      <Select.Item key={option.value} value={option.value}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.color')} <span className="text-red-500">*</span>
              </label>
              <Select.Root
                value={formData.color_id ? formData.color_id.toString() : ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, color_id: Number(value) || 0 }))}
              >
                <Select.Trigger className="w-full">
                  <Select.Value placeholder={t('cars.color')} />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {colorOptions.map(option => (
                      <Select.Item key={option.value} value={option.value}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        {/* Rental Specs Section */}
        <div>
          <h3 className="font-sakr font-medium text-lg text-gray-900 mb-4">
            {t('form.rentalSpecs')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Daily Rental Pricing */}
            {formData.rental_type === 'daily' && (
              <>
                <Input
                  type="number"
                  label={t('cars.dailyPrice')}
                  value={formData.price_per_day ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, price_per_day: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
                <Input
                  type="number"
                  label={t('cars.allowedKilometers')}
                  value={formData.allowed_kilometers ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, allowed_kilometers: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
              </>
            )}

            {/* Long-term Rental Pricing */}
            {formData.rental_type === 'long_term' && (
              <>
                <Input
                  type="number"
                  label={t('cars.months36Price')}
                  value={formData.months_36_price ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, months_36_price: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
                <Input
                  type="number"
                  label={t('cars.months48Price')}
                  value={formData.months_48_price ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, months_48_price: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
              </>
            )}

            {/* Leasing Pricing */}
            {formData.rental_type === 'leasing' && (
              <>
                <Input
                  type="number"
                  label={t('cars.downpayment')}
                  value={formData.downpayment ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, downpayment: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
                <Input
                  type="number"
                  label={t('cars.months36Price')}
                  value={formData.months_36_price ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, months_36_price: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
                <Input
                  type="number"
                  label={t('cars.months48Price')}
                  value={formData.months_48_price ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, months_48_price: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
                <Input
                  type="number"
                  label={t('cars.finalPayment')}
                  value={formData.final_payment ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, final_payment: value === '' ? 0 : Number(value) }));
                  }}
                  min={0}
                  required
                />
              </>
            )}

            <Input
              type="number"
              label={t('cars.availableCount')}
              value={formData.available_count ?? ''}
              onChange={e => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, available_count: value === '' ? 0 : Number(value) }));
              }}
              min={0}
              required
            />
          </div>
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const CarCard = ({ car }: { car: Car }) => (
    <div className="bg-surface rounded-lg border border-outline-variant p-4 md:hidden space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-sakr font-medium text-base">
            {car.brand_name} {car.model_name}
          </p>
          <div className="mt-2 space-y-1">
            <p className="font-sakr text-sm text-gray-600">
              {t('cars.availableCount')}: <span className={car.available_count > 0 ? 'text-green-600' : 'text-red-600'}>
                {car.available_count}
              </span>
            </p>
            {/* Conditional pricing for mobile cards */}
            {rentalType === RentalType.Daily && (
              <div className="space-y-1">
                {/* Base daily price */}
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.dailyPrice')}: {car.price_per_day} {t('cars.kdPerDay')}
                </p>
                {/* Show tiered prices if user has configured tiers */}
                {userPriceTiers.length > 0 && userPriceTiers.map((tier) => {
                  const tierPrice = car.tiered_prices?.find(tp => tp.tier_name === tier.tier_name);
                  const displayPrice = tierPrice ? tierPrice.tier_price : car.price_per_day;
                  
                  return (
                    <p key={tier.tier_name} className="font-sakr text-sm text-gray-600">
                      {tier.tier_name}: {displayPrice} {t('cars.kdPerDay')}
                    </p>
                  );
                })}
              </div>
            )}
            {rentalType === RentalType.LongTerm && (
              <>
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.months36')}: {car.months_36_price || 0} {t('cars.kdPerMonth')}
                </p>
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.months48')}: {car.months_48_price || 0} {t('cars.kdPerMonth')}
                </p>
              </>
            )}
            {rentalType === RentalType.Leasing && (
              <>
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.downpaymentLabel')}: {car.downpayment || 0} {t('cars.kd')}
                </p>
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.months36')}: {car.months_36_price || 0} {t('cars.kdPerMonth')}
                </p>
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.months48')}: {car.months_48_price || 0} {t('cars.kdPerMonth')}
                </p>
                <p className="font-sakr text-sm text-gray-600">
                  {t('cars.finalPaymentLabel')}: {car.final_payment || 0} {t('cars.kd')}
                </p>
              </>
            )}
          </div>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[180px] bg-white rounded-lg shadow-lg py-1 border border-gray-200">
              <DropdownMenu.Item 
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={() => openDeleteDialog(car)}
              >
                <TrashIcon className="w-4 h-4" />
                {t('cars.deleteCar')}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );

  // Enhanced Empty State Component
  const EmptyInventoryState = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Illustration */}
        <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-primary-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Garage/Building Structure */}
            <rect x="30" y="140" width="140" height="40" rx="4" fill="currentColor" opacity="0.2"/>
            <rect x="40" y="130" width="120" height="10" fill="currentColor" opacity="0.3"/>
            
            {/* Garage Door */}
            <rect x="50" y="140" width="100" height="35" rx="2" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            <rect x="55" y="145" width="90" height="25" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            
            {/* Door Handle */}
            <circle cx="140" cy="157" r="2" fill="currentColor" opacity="0.5"/>
            
            {/* Empty Parking Spaces */}
            <rect x="60" y="155" width="25" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" opacity="0.4"/>
            <rect x="87" y="155" width="25" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" opacity="0.4"/>
            <rect x="114" y="155" width="25" height="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" opacity="0.4"/>
            
            {/* Plus Icon in Center */}
            <circle cx="100" cy="90" r="25" fill="currentColor" opacity="0.15"/>
            <circle cx="100" cy="90" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            <path d="M100 80v20M90 90h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
            
            {/* Small clouds/decoration */}
            <circle cx="60" cy="50" r="8" fill="currentColor" opacity="0.1"/>
            <circle cx="68" cy="47" r="6" fill="currentColor" opacity="0.1"/>
            <circle cx="140" cy="55" r="6" fill="currentColor" opacity="0.1"/>
            <circle cx="146" cy="52" r="4" fill="currentColor" opacity="0.1"/>
          </svg>
        </div>
        
        {/* Title */}
        <h3 className="font-sakr font-bold text-2xl mb-4 text-on-surface text-center">
          {searchTerm ? t('empty.noSearchResults') : t('empty.noInventory')}
        </h3>
        
        {/* Description */}
        <p className="font-sakr font-normal text-lg text-on-surface-variant mb-8 leading-relaxed text-center">
          {searchTerm ? t('empty.noSearchResultsDesc') : t('empty.noInventoryDesc')}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 items-center">
          {searchTerm ? (
            <Button variant="primary" size="lg" onClick={() => handleSearch('')}>
              {t('empty.clearFilters')}
            </Button>
          ) : (
            <>
              <div className="flex gap-3">
                <Button variant={rentalType === RentalType.Daily ? 'outline' : 'primary'} size="lg" onClick={openAddModal}>
                  {t('empty.addFirstCar')}
                </Button>
                {/* Show bulk upload option only for daily rentals */}
                {rentalType === RentalType.Daily && (
                  <Button variant="primary" size="lg" onClick={() => setShowBulkUpload(true)}>
                    {t('bulkUpload.bulkUpload', 'Bulk Upload')}
                  </Button>
                )}
              </div>
              
              {/* Bulk Upload Section for Empty State */}
              {rentalType === RentalType.Daily && (
                <div className="mt-6 w-full max-w-2xl">
                  <BulkCarUpload
                    onUploadComplete={handleBulkUploadComplete}
                    isVisible={showBulkUpload}
                    onToggle={() => setShowBulkUpload(!showBulkUpload)}
                  />
                </div>
              )}
            </>
          )}
        </div>
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
            <Button variant="outline" size="small">
              {t('form.bulkEdit')}
            </Button>
            <Button variant="destructive" size="small">
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

  // Update header text based on rental type
  const getHeaderText = () => {
    if (rentalType === RentalType.Daily) return t('nav.inventory.daily');
    if (rentalType === RentalType.LongTerm) return t('nav.inventory.longTerm');
    if (rentalType === RentalType.Leasing) return t('nav.inventory.leasing');
    return t('nav.inventory');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
            {getHeaderText()}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('dashboard.carInventoryDesc')}
          </p>
        </div>
        {/* Only show Add New Car button when inventory is not empty */}
        {cars.length > 0 && (
          <div className="flex gap-3">
            <Button onClick={openAddModal}>
              {t('dashboard.addNewCar')}
            </Button>
            {/* Show bulk upload option only for daily rentals */}
            {rentalType === RentalType.Daily && !showBulkUpload && (
              <Button variant="outline" onClick={() => setShowBulkUpload(true)}>
                {t('bulkUpload.bulkUpload')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Upload Section - Only show for daily rentals when toggled */}
      {rentalType === RentalType.Daily && cars.length > 0 && (
        <BulkCarUpload
          onUploadComplete={handleBulkUploadComplete}
          isVisible={showBulkUpload}
          onToggle={() => setShowBulkUpload(!showBulkUpload)}
        />
      )}

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
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        {t('cars.title')}
                      </th>
                      <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        {t('cars.availableCount')}
                      </th>
                      {/* Conditional pricing columns based on rental type */}
                      {rentalType === RentalType.Daily && (
                        <>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.dailyPrice')}
                          </th>
                          {userPriceTiers.map((tier) => (
                            <th key={tier.tier_name} className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                              {tier.tier_name}
                            </th>
                          ))}
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.allowedKilometers')}
                          </th>
                        </>
                      )}
                      {rentalType === RentalType.LongTerm && (
                        <>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.months36')}
                          </th>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.months48')}
                          </th>
                        </>
                      )}
                      {rentalType === RentalType.Leasing && (
                        <>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.downpaymentLabel')}
                          </th>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.months36')}
                          </th>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.months48')}
                          </th>
                          <th className="px-4 py-3 font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            {t('cars.finalPaymentLabel')}
                          </th>
                        </>
                      )}
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-neutral-25 transition-colors">
                        <td className="px-4 py-4 font-sakr font-medium text-sm text-text-primary">
                          {car.brand_name} {car.model_name}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            car.available_count > 0 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {car.available_count}
                          </span>
                        </td>
                        {/* Conditional pricing data based on rental type */}
                        {rentalType === RentalType.Daily && (
                          <>
                            {/* Base daily price */}
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.price_per_day} {t('cars.kdPerDay')}
                              </span>
                            </td>
                            {/* Dynamic tier prices */}
                            {userPriceTiers.map((tier) => {
                              // Find matching tier price from car's tiered_prices
                              const tierPrice = car.tiered_prices?.find(tp => tp.tier_name === tier.tier_name);
                              const displayPrice = tierPrice ? tierPrice.tier_price : car.price_per_day;
                              
                              return (
                                <td key={tier.tier_name} className="px-4 py-4 font-sakr text-sm text-text-secondary">
                                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                    {displayPrice} {t('cars.kdPerDay')}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              {car.allowed_kilometers} {t('cars.km')}
                            </td>
                          </>
                        )}
                        {rentalType === RentalType.LongTerm && (
                          <>
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.months_36_price || 0} {t('cars.kdPerMonth')}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.months_48_price || 0} {t('cars.kdPerMonth')}
                              </span>
                            </td>
                          </>
                        )}
                        {rentalType === RentalType.Leasing && (
                          <>
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.downpayment || 0} {t('cars.kd')}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.months_36_price || 0} {t('cars.kdPerMonth')}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.months_48_price || 0} {t('cars.kdPerMonth')}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-sakr text-sm text-text-secondary">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800">
                                {car.final_payment || 0} {t('cars.kd')}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-4">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <EllipsisVerticalIcon className="w-5 h-5" />
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content className="min-w-[180px] bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                                <DropdownMenu.Item 
                                  className="flex gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                                  onClick={() => openDeleteDialog(car)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  {t('cars.deleteCar')}
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
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
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
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