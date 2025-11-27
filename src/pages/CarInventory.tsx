import React, { useState, useEffect, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import {
  Button,
  Input,
  Modal,
  ModalFooter,
  Select,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@mo_sami/web-design-system';
import { EllipsisVerticalIcon, TrashIcon, ClipboardDocumentCheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import {
  CarApiService,
  Car,
  CarFormData,
  validateCarForm
} from '../services/carApi';
import { PriceTier, getPriceTiers } from '../services/priceTiersApi';
import BulkCarUpload from '../components/BulkCarUpload';
import {
  getCarAttributes,
  getAttributeOptions,
  getOptionLabel,
  getModelsForBrand,
  Attribute,
  AttributeOption
} from '../services/attributesApi';

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

type CarFormProps = {
  t: TFunction;
  language: string;
  formData: Partial<CarFormData>;
  formErrors: string[];
  setFormData: Dispatch<SetStateAction<Partial<CarFormData>>>;
  brandOptions: AttributeOption[];
  modelOptions: AttributeOption[];
  yearOptions: AttributeOption[];
  bodyTypeOptions: AttributeOption[];
  transmissionOptions: AttributeOption[];
  colorOptions: AttributeOption[];
  showCarSpecs: boolean;
};

const CarForm: React.FC<CarFormProps> = ({
  t,
  language,
  formData,
  formErrors,
  setFormData,
  brandOptions,
  modelOptions,
  yearOptions,
  bodyTypeOptions,
  transmissionOptions,
  colorOptions,
  showCarSpecs,
}) => {
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

      {showCarSpecs && (
        <div>
          <h3 className="font-sakr font-medium text-lg text-gray-900 mb-4">
            {t('form.carSpecs')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.brand')} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.remote_brand_id ? formData.remote_brand_id.toString() : ''}
                onValueChange={value => setFormData(prev => ({ ...prev, remote_brand_id: Number(value) || 0 }))}
                options={brandOptions.map(option => ({ value: option.id.toString(), label: getOptionLabel(option, language) }))}
                placeholder={t('cars.brand')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.model')} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.remote_model_id ? formData.remote_model_id.toString() : ''}
                onValueChange={value => setFormData(prev => ({ ...prev, remote_model_id: Number(value) || 0 }))}
                options={modelOptions.map(option => ({ value: option.id.toString(), label: getOptionLabel(option, language) }))}
                placeholder={!formData.remote_brand_id ? t('form.selectBrandFirst') : t('common.select')}
                disabled={!formData.remote_brand_id || modelOptions.length === 0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.year')} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.year ? formData.year.toString() : ''}
                onValueChange={value => setFormData(prev => ({ ...prev, year: Number(value) || 0 }))}
                options={yearOptions.map(option => ({ value: option.id.toString(), label: getOptionLabel(option, language) }))}
                placeholder={t('cars.year')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.bodyType')} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.remote_body_type_id ? formData.remote_body_type_id.toString() : ''}
                onValueChange={value => setFormData(prev => ({ ...prev, remote_body_type_id: Number(value) || 0 }))}
                options={bodyTypeOptions.map(option => ({ value: option.id.toString(), label: getOptionLabel(option, language) }))}
                placeholder={t('cars.bodyType')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.transmission')} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.transmission ? formData.transmission.toString() : ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: Number(value) }))}
                options={transmissionOptions.map(option => ({ value: option.id.toString(), label: getOptionLabel(option, language) }))}
                placeholder={t('cars.transmission')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('cars.color')} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.remote_color_id ? formData.remote_color_id.toString() : ''}
                onValueChange={value => setFormData(prev => ({ ...prev, remote_color_id: Number(value) || 0 }))}
                options={colorOptions.map(option => ({ value: option.id.toString(), label: getOptionLabel(option, language) }))}
                placeholder={t('cars.color')}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-sakr font-medium text-lg text-gray-900 mb-4">
          {t('form.rentalSpecs')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {formData.rental_type === 'daily' && (
            <>
              <Input
                type="number"
                label={t('cars.dailyPrice')}
                placeholder='0'
                onChange={e => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, price_per_day: value === '' ? 0 : Number(value) }));
                }}
                required
              />
              <Input
                type="number"
                label={t('cars.allowedKilometers')}
                placeholder='0'
                onChange={e => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, allowed_kilometers: value === '' ? 0 : Number(value) }));
                }}
                min={0}
                required
              />
            </>
          )}

          {formData.rental_type === 'long_term' && (
            <>
              <Input
                type="number"
                label={t('cars.months36Price')}
                placeholder='0'
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
                placeholder='0'
                onChange={e => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, months_48_price: value === '' ? 0 : Number(value) }));
                }}
                min={0}
                required
              />
            </>
          )}

          {formData.rental_type === 'leasing' && (
            <>
              <Input
                type="number"
                label={t('cars.downpayment')}
                placeholder='0'
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
                placeholder='0'
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
                placeholder='0'
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
                placeholder='0'
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
            placeholder='0'
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
  const [selectedCars, setSelectedCars] = useState<Set<number>>(new Set());
  const [userPriceTiers, setUserPriceTiers] = useState<PriceTier[]>([]);
  const [attributes, setAttributes] = useState<Attribute[] | null>(null);

  const sortOptionsDescending = useCallback(
    (options: AttributeOption[]) => {
      const locale = language === 'ar' ? 'ar' : 'en';
      return [...options].sort((a, b) => {
        const labelA = getOptionLabel(a, language) || '';
        const labelB = getOptionLabel(b, language) || '';
        const valueA = Number(labelA);
        const valueB = Number(labelB);

        // Before 1980 should be at the end
        const isA_Before_1980 = a.label_en === 'Before 1980';
        const isB_Before_1980 = b.label_en === 'Before 1980';

        if (isA_Before_1980 && !isB_Before_1980) return 1;
        if (isB_Before_1980 && !isA_Before_1980) return -1;

        if (!Number.isNaN(valueA) && !Number.isNaN(valueB)) {
          return valueB - valueA;
        }

        return labelB.localeCompare(labelA, locale, {
          sensitivity: 'base',
          numeric: true,
        });
      });
    },
    [language]
  );

  const sortOptionsAscending = useCallback(
    (options: AttributeOption[]) => {
      const locale = language === 'ar' ? 'ar' : 'en';
      return [...options].sort((a, b) => {
        const labelA = getOptionLabel(a, language) || '';
        const labelB = getOptionLabel(b, language) || '';
        const valueA = Number(labelA);
        const valueB = Number(labelB);
  
        // If both labels are numeric, sort numerically (ascending)
        if (!Number.isNaN(valueA) && !Number.isNaN(valueB)) {
          return valueA - valueB;
        }
  
        // Otherwise, sort lexicographically (ascending)
        return labelA.localeCompare(labelB, locale, {
          sensitivity: 'base',
          numeric: true,
        });
      });
    },
    [language]
  );
  // Helper functions to derive brand and model names - rely on backend display names only
  const getBrandName = useCallback(
    (car: Car): string => {
      return car.brand_name || '';
    },
    []
  );

  const getModelName = useCallback(
    (car: Car): string => {
      return car.model_name || '';
    },
    []
  );

  const getCarDisplayName = useCallback(
    (car: Car): string => {
      const brand = getBrandName(car);
      const model = getModelName(car);
      return `${brand} ${model}`.trim();
    },
    [getBrandName, getModelName]
  );

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [carToMarkUnavailable, setCarToMarkUnavailable] = useState<Car | null>(null);
  const [unavailableStartDate, setUnavailableStartDate] = useState<string>('');
  const [unavailableEndDate, setUnavailableEndDate] = useState<string>('');

  // Quick Edit Modal state (price, allowed_kilometers, available_count)
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [quickEditCar, setQuickEditCar] = useState<Car | null>(null);
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [quickAllowedKm, setQuickAllowedKm] = useState<number>(0);
  const [quickAvailable, setQuickAvailable] = useState<number>(0);
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);

  // Bulk upload state
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CarFormData>>({
    rental_type: (() => {
      // Convert URL format to API format for rental type
      if (rentalType === RentalType.Daily) return 'daily';
      if (rentalType === RentalType.LongTerm) return 'long_term';
      if (rentalType === RentalType.Leasing) return 'leasing';
      return 'daily';
    })()
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      // Convert URL format to API format for rental type
      let apiRentalType: string | undefined = undefined;
      if (rentalType === RentalType.Daily) apiRentalType = 'daily';
      if (rentalType === RentalType.LongTerm) apiRentalType = 'long_term';
      if (rentalType === RentalType.Leasing) apiRentalType = 'leasing';

      // When searching, fetch a larger batch and filter client-side because backend does not apply search filtering.
      const isSearching = Boolean(searchTerm && searchTerm.trim().length > 0);
      const requestParams = {
        limit: isSearching ? 1000 : pageSize,
        offset: isSearching ? 0 : (currentPage - 1) * pageSize,
        search: searchTerm || undefined,
        rentalType: apiRentalType
      } as const;

      const response = await CarApiService.getCars(requestParams);

      if (isSearching) {
        const term = searchTerm.trim().toLowerCase();
        const filtered = (response.cars || []).filter((car) => {
          const name = getCarDisplayName(car).toLowerCase();
          const yearStr = String(car.year || '').toLowerCase();
          return name.includes(term) || yearStr.includes(term);
        });
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setCars(filtered.slice(start, end));
        setTotalCars(filtered.length);
      } else {
        setCars(response.cars || []);
        setTotalCars(response.total || 0);
      }
      setSelectedCars(new Set()); // Clear selection when loading new data
    } catch (error) {
      console.error('Error loading cars:', error);
      setCars([]);
      setTotalCars(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, rentalType, getCarDisplayName]);

  const loadUserPriceTiers = useCallback(async () => {
    try {
      const tiers = await getPriceTiers();
      setUserPriceTiers(tiers);
    } catch (error) {
      console.error('Error loading price tiers:', error);
      setUserPriceTiers([]);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadCars();
    getCarAttributes()
      .then(attrs => {
        setAttributes(attrs);
      })
      .catch(err => {
        console.error('Failed to load car attributes');
      });
    if (rentalType === RentalType.Daily) {
      loadUserPriceTiers();
    }
  }, [currentPage, searchTerm, rentalType, loadCars, loadUserPriceTiers]);

  // Convert data to SelectOption format - use dynamic attributes directly
  const brandOptions: AttributeOption[] = useMemo(() => {
    if (!attributes) return [];
    return sortOptionsAscending(getAttributeOptions(attributes, 'brand'));
  }, [attributes, sortOptionsDescending]);

  const modelOptions: AttributeOption[] = useMemo(() => {
    if (!attributes || !formData.remote_brand_id) return [];
    return sortOptionsAscending(getModelsForBrand(attributes, formData.remote_brand_id));
  }, [attributes, formData.remote_brand_id, sortOptionsDescending]);

  const colorOptions: AttributeOption[] = useMemo(() => {
    if (!attributes) return [];
    return sortOptionsAscending(getAttributeOptions(attributes, 'Color-Exterior'));
  }, [attributes, sortOptionsDescending]);

  const transmissionOptions: AttributeOption[] = useMemo(() => {
    if (!attributes) return [];
    return sortOptionsAscending(getAttributeOptions(attributes, 'transmission'));
  }, [attributes, sortOptionsDescending]);

  const bodyTypeOptions: AttributeOption[] = useMemo(() => {
    if (!attributes) return [];
    return sortOptionsAscending(getAttributeOptions(attributes, 'Body Type'));
  }, [attributes, sortOptionsDescending]);

  const yearOptions: AttributeOption[] = useMemo(() => {
    if (!attributes) return [];
    return sortOptionsDescending(getAttributeOptions(attributes, 'Year'));
  }, [attributes, sortOptionsDescending]);

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
      remote_brand_id: 0,
      remote_model_id: 0,
      remote_color_id: 0,
      remote_body_type_id: 0,
      year: new Date().getFullYear(),
      available_count: 1,
      transmission: 0,
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
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openDeleteDialog = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };

  const openUnavailableModal = (car: Car) => {
    setCarToMarkUnavailable(car);
    setUnavailableStartDate('');
    setUnavailableEndDate('');
    setIsUnavailableModalOpen(true);
  };

  const openQuickEdit = (car: Car) => {
    setQuickEditCar(car);
    setQuickPrice(car.price_per_day || 0);
    setQuickAllowedKm(car.allowed_kilometers || 0);
    setQuickAvailable(car.available_count || 0);
    setIsQuickEditOpen(true);
  };

  const handleQuickEditSave = async () => {
    if (!quickEditCar) return;
    setIsQuickSubmitting(true);
    try {
      await CarApiService.updateCarBasic(quickEditCar.id, {
        price_per_day: quickPrice,
        allowed_kilometers: quickAllowedKm,
        available_count: quickAvailable,
      });
      setIsQuickEditOpen(false);
      setQuickEditCar(null);
      await loadCars();
    } catch (error) {
      console.error('Error updating car basic fields:', error);
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  const handleSaveUnavailable = async () => {
    if (!carToMarkUnavailable || !unavailableStartDate || !unavailableEndDate) return;
    setIsSubmitting(true);
    try {
      await CarApiService.markUnavailable({
        car_id: carToMarkUnavailable.id,
        start_date: unavailableStartDate,
        end_date: unavailableEndDate,
        period_type: 'booking',
      });
      setIsUnavailableModalOpen(false);
      setCarToMarkUnavailable(null);
      await loadCars();
    } catch (error) {
      console.error('Error marking unavailable:', error);
    } finally {
      setIsSubmitting(false);
    }
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


  // Mobile Card Component
  const CarCard = ({ car }: { car: Car }) => (
    <div className="bg-surface rounded-lg border border-outline-variant p-4 md:hidden space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {car.photo_url ? (
              <img src={car.photo_url} alt={getCarDisplayName(car)} className="w-16 h-12 object-cover rounded" />
            ) : (
              <div className="w-16 h-12 bg-outline rounded" />
            )}
            <p className="font-sakr font-medium text-base">
              {getCarDisplayName(car)}
            </p>
          </div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 min-w-max">
            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer whitespace-nowrap"
              onSelect={() => openUnavailableModal(car)}
            >
              <ClipboardDocumentCheckIcon className="w-4 h-4" />
              {t('actions.markRented')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer whitespace-nowrap"
              onSelect={() => openQuickEdit(car)}
            >
              <PencilSquareIcon className="w-4 h-4" />
              {t('cars.updateCar')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap"
              onSelect={() => openDeleteDialog(car)}
            >
              <TrashIcon className="w-4 h-4" />
              {t('cars.deleteCar')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        {t('common.photo', 'Photo')}
                      </th>
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
                        <td className="px-4 py-4">
                          {car.photo_url ? (
                            <img src={car.photo_url} alt={getCarDisplayName(car)} className="w-16 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-12 bg-neutral-200 rounded" />
                          )}
                        </td>
                        <td className="px-4 py-4 font-sakr font-medium text-sm text-text-primary">
                          {getCarDisplayName(car)}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <EllipsisVerticalIcon className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="z-50 min-w-max">
                              <DropdownMenuItem
                                className="flex gap-2 px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer whitespace-nowrap"
                                onSelect={() => openUnavailableModal(car)}
                              >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                {t('actions.markRented')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex gap-2 px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer whitespace-nowrap"
                                onSelect={() => openQuickEdit(car)}
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                                {t('cars.updateCar')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap"
                                onSelect={() => openDeleteDialog(car)}
                              >
                                <TrashIcon className="w-4 h-4" />
                                {t('cars.deleteCar')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
        <CarForm
          t={t}
          language={language}
          formData={formData}
          formErrors={formErrors}
          setFormData={setFormData}
          brandOptions={brandOptions}
          modelOptions={modelOptions}
          yearOptions={yearOptions}
          bodyTypeOptions={bodyTypeOptions}
          transmissionOptions={transmissionOptions}
          colorOptions={colorOptions}
          showCarSpecs
        />
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
        <CarForm
          t={t}
          language={language}
          formData={formData}
          formErrors={formErrors}
          setFormData={setFormData}
          brandOptions={brandOptions}
          modelOptions={modelOptions}
          yearOptions={yearOptions}
          bodyTypeOptions={bodyTypeOptions}
          transmissionOptions={transmissionOptions}
          colorOptions={colorOptions}
          showCarSpecs={false}
        />
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
                      carName: `${getCarDisplayName(carToDelete)}`,
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

      {/* Mark Unavailable Modal */}
      <Modal
        open={isUnavailableModalOpen}
        onOpenChange={(open) => setIsUnavailableModalOpen(open)}
        title={t('actions.markRented')}
        size="md"
      >
        <div className="p-6">
          <p className="font-sakr font-normal text-sm text-on-surface-variant mb-4">
            {t('availability.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label={t('availability.form.startDate')}
              value={unavailableStartDate}
              onChange={(e) => setUnavailableStartDate(e.target.value)}
            />
            <Input
              type="date"
              label={t('availability.form.endDate')}
              value={unavailableEndDate}
              onChange={(e) => setUnavailableEndDate(e.target.value)}
            />
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setIsUnavailableModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveUnavailable} disabled={isSubmitting || !unavailableStartDate || !unavailableEndDate}>
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Quick Edit Modal */}
      <Modal
        open={isQuickEditOpen}
        onOpenChange={(open) => setIsQuickEditOpen(open)}
        title={t('cars.updateCar')}
        size="md"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rentalType === RentalType.Daily && (
              <Input
                type="number"
                label={t('cars.dailyPrice')}
                value={Number.isNaN(quickPrice) ? '' : quickPrice}
                onChange={(e) => setQuickPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                min={0}
              />
            )}
            {rentalType === RentalType.Daily && (
              <Input
                type="number"
                label={t('cars.allowedKilometers')}
                value={Number.isNaN(quickAllowedKm) ? '' : quickAllowedKm}
                onChange={(e) => setQuickAllowedKm(e.target.value === '' ? 0 : Number(e.target.value))}
                min={0}
              />
            )}
            <Input
              type="number"
              label={t('cars.availableCount')}
              value={Number.isNaN(quickAvailable) ? '' : quickAvailable}
              onChange={(e) => setQuickAvailable(e.target.value === '' ? 0 : Number(e.target.value))}
              min={0}
            />
          </div>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setIsQuickEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleQuickEditSave} disabled={isQuickSubmitting}>
              {isQuickSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CarInventory;
