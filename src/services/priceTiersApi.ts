import api from './api';

export interface PriceTier {
  id: number;
  user_id: number;
  tier_name: string;
  min_days: number;
  max_days?: number | null;
  multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface TieredPrice {
  tier_name: string;
  min_days: number;
  max_days?: number | null;
  base_price: number;
  tier_price: number;
  multiplier: number;
  discount_percentage: number;
}

export interface PriceTierFormData {
  tier_name: string;
  min_days: number;
  max_days?: number | null;
  multiplier: number;
}

// API response types
interface GetPriceTiersResponse {
  tiers: PriceTier[];
}

interface CreatePriceTierResponse {
  message: string;
  tier: PriceTier;
}

interface UpdatePriceTierResponse {
  message: string;
  tier: PriceTier;
}

interface DeletePriceTierResponse {
  message: string;
}

interface ResetPriceTiersResponse {
  message: string;
  tiers: PriceTier[];
}

// Get all price tiers for the authenticated user
export const getPriceTiers = async (): Promise<PriceTier[]> => {
  try {
    const response = await api.get<GetPriceTiersResponse>('/price-tiers');
    return response.data.tiers || [];
  } catch (error) {
    console.error('Error fetching price tiers:', error);
    throw error;
  }
};

// Create a new price tier
export const createPriceTier = async (priceTierData: PriceTierFormData): Promise<PriceTier> => {
  try {
    const response = await api.post<CreatePriceTierResponse>('/price-tiers', priceTierData);
    return response.data.tier;
  } catch (error) {
    console.error('Error creating price tier:', error);
    throw error;
  }
};

// Update an existing price tier
export const updatePriceTier = async (id: number, priceTierData: PriceTierFormData): Promise<PriceTier> => {
  try {
    const response = await api.put<UpdatePriceTierResponse>(`/price-tiers/${id}`, priceTierData);
    return response.data.tier;
  } catch (error) {
    console.error('Error updating price tier:', error);
    throw error;
  }
};

// Delete a price tier
export const deletePriceTier = async (id: number): Promise<void> => {
  try {
    await api.delete<DeletePriceTierResponse>(`/price-tiers/${id}`);
  } catch (error) {
    console.error('Error deleting price tier:', error);
    throw error;
  }
};

// Reset price tiers to defaults
export const resetPriceTiersToDefaults = async (): Promise<PriceTier[]> => {
  try {
    const response = await api.post<ResetPriceTiersResponse>('/price-tiers/reset-defaults');
    return response.data.tiers || [];
  } catch (error) {
    console.error('Error resetting price tiers to defaults:', error);
    throw error;
  }
}; 