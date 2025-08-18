import api from './api';

// TieredPrice interface from price tiers API
export interface TieredPrice {
  tier_name: string;
  min_days: number;
  max_days: number | null;
  base_price: number;
  tier_price: number;
  multiplier: number;
  discount_percentage: number;
}

// Types matching the backend API
export interface Car {
  id: number;
  user_id: number;
  year: number;
  // trim level removed
  available_count: number;
  rental_type: 'daily' | 'long_term' | 'leasing';
  price_per_day: number;
  allowed_kilometers: number;
  // New fields for long-term and leasing
  downpayment?: number;       // for leasing only
  months_36_price?: number;   // for long-term & leasing
  months_48_price?: number;   // for long-term & leasing
  final_payment?: number;     // for leasing only
  photo_url?: string;
  // Tiered pricing for daily rentals
  tiered_prices?: TieredPrice[];
  created_at: string;
  updated_at: string;
  // Display names populated from backend
  brand_name?: string;
  model_name?: string;
  color_name?: string;
  body_type_name?: string;
  transmission_name?: string;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  limit: number;
  offset: number;
}

export interface CarFormData {
  remote_brand_id: number;
  remote_model_id: number;
  remote_color_id: number;
  remote_body_type_id?: number;
  year: number;
  // trim level removed
  available_count: number;
  transmission: number;
  rental_type: 'daily' | 'long_term' | 'leasing';
  price_per_day: number;
  allowed_kilometers: number;
  // New fields for long-term and leasing
  downpayment?: number;       // for leasing only
  months_36_price?: number;   // for long-term & leasing
  months_48_price?: number;   // for long-term & leasing
  final_payment?: number;     // for leasing only
}

export interface GetCarsParams {
  limit?: number;
  offset?: number;
  search?: string;
  rentalType?: string;
}

// Bulk upload types
export interface BulkUploadResult {
  message: string;
  result: ImportResult;
}

export interface ImportResult {
  total_rows: number;
  processed_rows: number;
  success_count: number;
  error_count: number;
  errors: ImportError[];
  created_cars: Car[];
}

export interface ImportError {
  row: number;
  column: string;
  message: string;
  value: string;
}

// Car API Service
export class CarApiService {
  // Get cars with pagination and search
  static async getCars(params?: GetCarsParams): Promise<CarsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.rentalType) queryParams.append('rental_type', params.rentalType);

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

  // Bulk upload cars via Excel file
  static async bulkUploadCars(file: File): Promise<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/cars/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Download Excel template
  static async downloadTemplate(): Promise<void> {
    const response = await api.get('/cars/template', {
      responseType: 'blob',
    });

    // Create download link
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'car_inventory_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// React Query keys for cache management
export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...carQueryKeys.lists(), { filters }] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...carQueryKeys.details(), id] as const,
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

  if (!data.remote_brand_id) errors.push('Brand is required');
  if (!data.remote_model_id) errors.push('Model is required');
  if (!data.year) {
    errors.push('Year is required');
  }
  if (!data.remote_color_id) errors.push('Color is required');
  if (data.available_count === undefined || data.available_count < 0) {
    errors.push('Available count must be 0 or greater');
  }
  if (!data.transmission || data.transmission <= 0) errors.push('Transmission is required');

  // Conditional validation based on rental type
  if (data.rental_type === 'daily') {
    if (data.price_per_day === undefined || data.price_per_day <= 0) {
      errors.push('Price per day is required and must be greater than 0 for daily rentals');
    }
    if (data.allowed_kilometers === undefined || data.allowed_kilometers <= 0) {
      errors.push('Allowed kilometers is required and must be greater than 0 for daily rentals');
    }
  } else if (data.rental_type === 'long_term') {
    if (!data.months_36_price || data.months_36_price <= 0) {
      errors.push('36 months price is required and must be greater than 0 for long-term rentals');
    }
    if (!data.months_48_price || data.months_48_price <= 0) {
      errors.push('48 months price is required and must be greater than 0 for long-term rentals');
    }
  } else if (data.rental_type === 'leasing') {
    if (!data.downpayment || data.downpayment <= 0) {
      errors.push('Downpayment is required and must be greater than 0 for leasing');
    }
    if (!data.months_36_price || data.months_36_price <= 0) {
      errors.push('36 months price is required and must be greater than 0 for leasing');
    }
    if (!data.months_48_price || data.months_48_price <= 0) {
      errors.push('48 months price is required and must be greater than 0 for leasing');
    }
    if (!data.final_payment || data.final_payment <= 0) {
      errors.push('Final payment is required and must be greater than 0 for leasing');
    }
  }

  return errors;
};

// Utility functions for displaying data
export const formatCarDisplayName = (car: Car, language: string = 'en'): string => {
  return `${car.brand_name || ''} ${car.model_name || ''} ${car.year}`.trim();
};

// Export CarApiService as CarApi for new component compatibility
export const CarApi = CarApiService;
