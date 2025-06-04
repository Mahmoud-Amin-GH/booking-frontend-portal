import api from './api';

export interface OfficeConfigData {
  id?: number;
  user_id?: number;
  location_configs: Record<string, boolean>;
  service_configs: Record<string, boolean>;
  delivery_configs: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface OfficeConfigsResponse {
  configs: OfficeConfigData;
}

export interface UpdateOfficeConfigsRequest {
  location_configs: Record<string, boolean>;
  service_configs: Record<string, boolean>;
  delivery_configs: Record<string, boolean>;
}

export interface UpdateOfficeConfigsResponse {
  message: string;
  configs: OfficeConfigData;
}

export class OfficeConfigsApiService {
  /**
   * Get office configurations for the authenticated user
   */
  static async getOfficeConfigs(): Promise<OfficeConfigData> {
    try {
      const response = await api.get<OfficeConfigsResponse>('/office-configs');
      return response.data.configs;
    } catch (error: any) {
      console.error('Error fetching office configurations:', error);
      throw new Error(
        error?.response?.data?.error || 
        'Failed to fetch office configurations'
      );
    }
  }

  /**
   * Update office configurations for the authenticated user
   */
  static async updateOfficeConfigs(
    configData: UpdateOfficeConfigsRequest
  ): Promise<OfficeConfigData> {
    try {
      const response = await api.put<UpdateOfficeConfigsResponse>(
        '/office-configs',
        configData
      );
      return response.data.configs;
    } catch (error: any) {
      console.error('Error updating office configurations:', error);
      throw new Error(
        error?.response?.data?.error || 
        'Failed to update office configurations'
      );
    }
  }

  /**
   * Delete office configurations for the authenticated user
   */
  static async deleteOfficeConfigs(): Promise<void> {
    try {
      await api.delete('/office-configs');
    } catch (error: any) {
      console.error('Error deleting office configurations:', error);
      throw new Error(
        error?.response?.data?.error || 
        'Failed to delete office configurations'
      );
    }
  }

  /**
   * Reset all configurations to default (all disabled)
   */
  static async resetOfficeConfigs(): Promise<OfficeConfigData> {
    const defaultConfigs: UpdateOfficeConfigsRequest = {
      location_configs: {},
      service_configs: {},
      delivery_configs: {},
    };

    return this.updateOfficeConfigs(defaultConfigs);
  }
} 