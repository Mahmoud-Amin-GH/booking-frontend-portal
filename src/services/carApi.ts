import api from './api';

// Types matching the backend API
export interface Car {
  id: number;
  user_id: number;
  brand_id: number;
  model_id: number;
  year: number;
  seats: number;
  color_id: number;
  trim_level: string;
  available_count: number;
  transmission: 'manual' | 'automatic';
  car_type: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'pickup' | 'van';
  price_per_day: number;
  allowed_kilometers: number;
  created_at: string;
  updated_at: string;
  // Populated fields from joins
  brand_name?: string;
  model_name?: string;
  color_name?: string;
}

export interface Brand {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface Model {
  id: number;
  brand_id: number;
  name_en: string;
  name_ar: string;
}

export interface Color {
  id: number;
  name_en: string;
  name_ar: string;
  hex_code: string;
}

export interface DropdownOption {
  value: string;
  label_en: string;
  label_ar: string;
}

export interface CarOptions {
  brands: Brand[];
  colors: Color[];
  transmissions: DropdownOption[];
  car_types: DropdownOption[];
  trim_levels: DropdownOption[];
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  limit: number;
  offset: number;
}

export interface CarFormData {
  brand_id: number;
  model_id: number;
  year: number;
  seats: number;
  color_id: number;
  trim_level: string;
  available_count: number;
  transmission: 'manual' | 'automatic';
  car_type: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'pickup' | 'van';
  price_per_day: number;
  allowed_kilometers: number;
}

// Car API Service
export class CarApiService {
  // Get cars with pagination and search
  static async getCars(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<CarsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/cars?${queryParams.toString()}`);
    return response.data;
  }

  // Get specific car by ID
  static async getCarById(id: number): Promise<{ car: Car }> {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  }

  // Create new car
  static async createCar(carData: CarFormData): Promise<{ message: string; car: Car }> {
    const response = await api.post('/cars', carData);
    return response.data;
  }

  // Update existing car
  static async updateCar(id: number, carData: CarFormData): Promise<{ message: string; car: Car }> {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  }

  // Delete car
  static async deleteCar(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  }

  // Get form options (brands, colors, transmissions, car types)
  static async getCarOptions(): Promise<{ options: CarOptions }> {
    const response = await api.get('/cars/options');
    return response.data;
  }

  // Get models for specific brand
  static async getModelsByBrand(brandId: number): Promise<{ models: Model[] }> {
    const response = await api.get(`/brands/${brandId}/models`);
    return response.data;
  }
}

// React Query keys for cache management
export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...carQueryKeys.lists(), { filters }] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...carQueryKeys.details(), id] as const,
  options: () => [...carQueryKeys.all, 'options'] as const,
  models: (brandId: number) => [...carQueryKeys.all, 'models', brandId] as const,
};

// Error handling types
export interface ApiError {
  error: string;
  message?: string;
  details?: string;
}

// Form validation helpers
export const validateCarForm = (data: Partial<CarFormData>): string[] => {
  const errors: string[] = [];

  if (!data.brand_id) errors.push('Brand is required');
  if (!data.model_id) errors.push('Model is required');
  if (!data.year || data.year < 1900 || data.year > 2030) {
    errors.push('Year must be between 1900 and 2030');
  }
  if (!data.seats || data.seats < 1 || data.seats > 12) {
    errors.push('Seats must be between 1 and 12');
  }
  if (!data.color_id) errors.push('Color is required');
  if (data.available_count === undefined || data.available_count < 0) {
    errors.push('Available count must be 0 or greater');
  }
  if (!data.transmission) errors.push('Transmission is required');
  if (!data.car_type) errors.push('Car type is required');
  if (data.price_per_day === undefined || data.price_per_day < 0) {
    errors.push('Price per day must be 0 or greater');
  }

  return errors;
};

// Utility functions for displaying data
export const getLocalizedBrandName = (brand: Brand, language: string): string => {
  return language === 'ar' ? brand.name_ar : brand.name_en;
};

export const getLocalizedModelName = (model: Model, language: string): string => {
  return language === 'ar' ? model.name_ar : model.name_en;
};

export const getLocalizedColorName = (color: Color, language: string): string => {
  return language === 'ar' ? color.name_ar : color.name_en;
};

export const getLocalizedDropdownLabel = (option: DropdownOption, language: string): string => {
  return language === 'ar' ? option.label_ar : option.label_en;
};

export const formatCarDisplayName = (car: Car, language: string = 'en'): string => {
  return `${car.brand_name || ''} ${car.model_name || ''} ${car.year}`.trim();
}; 