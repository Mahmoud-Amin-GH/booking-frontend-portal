import api from './api';

// Types
export interface CarAvailabilityPeriod {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  available_count: number;
  period_type: 'booking' | 'maintenance' | 'blocked' | 'available';
  reason?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface QuarterlyPlan {
  id: number;
  user_id: number;
  quarter: number;
  year: number;
  target_utilization_rate: number;
  maintenance_buffer_days: number;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceSchedule {
  id: number;
  car_id: number;
  maintenance_type: 'routine' | 'repair' | 'inspection' | 'upgrade';
  scheduled_date: string;
  estimated_duration_days: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  cost?: number;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityMetrics {
  utilization_rate: number;
  total_available_days: number;
  total_booked_days: number;
  total_maintenance_days: number;
  total_blocked_days: number;
}

// Request/Response Types
export interface GetAvailabilityPeriodsParams {
  car_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface GetQuarterlyPlansParams {
  year?: number;
  quarter?: number;
  status?: 'draft' | 'active' | 'completed';
}

export interface GetMaintenanceSchedulesParams {
  car_id?: number;
  start_date?: string;
  end_date?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// API Service
export class AvailabilityApiService {
  // Availability Periods
  static async getAvailabilityPeriods(params?: GetAvailabilityPeriodsParams): Promise<CarAvailabilityPeriod[]> {
    const queryParams = new URLSearchParams();
    if (params?.car_id) queryParams.append('car_id', params.car_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await api.get(`/availability/periods?${queryParams.toString()}`);
    return response.data.periods;
  }

  static async createAvailabilityPeriod(data: Omit<CarAvailabilityPeriod, 'id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<CarAvailabilityPeriod> {
    const response = await api.post('/availability/periods', data);
    return response.data.period;
  }

  static async updateAvailabilityPeriod(id: number, data: Partial<CarAvailabilityPeriod>): Promise<CarAvailabilityPeriod> {
    const response = await api.put(`/availability/periods/${id}`, data);
    return response.data.period;
  }

  static async deleteAvailabilityPeriod(id: number): Promise<void> {
    await api.delete(`/availability/periods/${id}`);
  }

  // Quarterly Plans
  static async getQuarterlyPlans(params?: GetQuarterlyPlansParams): Promise<QuarterlyPlan[]> {
    const queryParams = new URLSearchParams();
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.quarter) queryParams.append('quarter', params.quarter.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await api.get(`/availability/quarterly-plans?${queryParams.toString()}`);
    return response.data.plans;
  }

  static async createQuarterlyPlan(data: Omit<QuarterlyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<QuarterlyPlan> {
    const response = await api.post('/availability/quarterly-plans', data);
    return response.data.plan;
  }

  static async updateQuarterlyPlan(id: number, data: Partial<QuarterlyPlan>): Promise<QuarterlyPlan> {
    const response = await api.put(`/availability/quarterly-plans/${id}`, data);
    return response.data.plan;
  }

  static async activateQuarterlyPlan(id: number): Promise<QuarterlyPlan> {
    const response = await api.post(`/availability/quarterly-plans/${id}/activate`);
    return response.data.plan;
  }

  // Maintenance Schedules
  static async getMaintenanceSchedules(params?: GetMaintenanceSchedulesParams): Promise<MaintenanceSchedule[]> {
    const queryParams = new URLSearchParams();
    if (params?.car_id) queryParams.append('car_id', params.car_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.status) queryParams.append('status', params.status);

    const response = await api.get(`/availability/maintenance?${queryParams.toString()}`);
    return response.data.schedules;
  }

  static async createMaintenanceSchedule(data: Omit<MaintenanceSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceSchedule> {
    const response = await api.post('/availability/maintenance', data);
    return response.data.schedule;
  }

  static async updateMaintenanceSchedule(id: number, data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
    const response = await api.put(`/availability/maintenance/${id}`, data);
    return response.data.schedule;
  }

  static async completeMaintenanceSchedule(id: number, cost: number): Promise<MaintenanceSchedule> {
    const response = await api.post(`/availability/maintenance/${id}/complete`, { cost });
    return response.data.schedule;
  }

  // Availability Metrics
  static async getAvailabilityMetrics(carId: number, startDate: string, endDate: string): Promise<AvailabilityMetrics> {
    const queryParams = new URLSearchParams({
      car_id: carId.toString(),
      start_date: startDate,
      end_date: endDate
    });

    const response = await api.get(`/availability/metrics?${queryParams.toString()}`);
    return response.data.metrics;
  }
}

// React Query keys for cache management
export const availabilityQueryKeys = {
  all: ['availability'] as const,
  periods: () => [...availabilityQueryKeys.all, 'periods'] as const,
  period: (id: number) => [...availabilityQueryKeys.periods(), id] as const,
  quarterlyPlans: () => [...availabilityQueryKeys.all, 'quarterly-plans'] as const,
  quarterlyPlan: (id: number) => [...availabilityQueryKeys.quarterlyPlans(), id] as const,
  maintenance: () => [...availabilityQueryKeys.all, 'maintenance'] as const,
  maintenanceSchedule: (id: number) => [...availabilityQueryKeys.maintenance(), id] as const,
  metrics: () => [...availabilityQueryKeys.all, 'metrics'] as const,
};

// Export for new component compatibility
export const AvailabilityApi = AvailabilityApiService; 