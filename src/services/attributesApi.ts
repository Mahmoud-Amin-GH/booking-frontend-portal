import axios from 'axios';
import { FORSALE_INTEGRATIONS_API_BASE_URL } from './api';

// Attribute and option types based on remote API
export interface AttributeOption {
  id: number;
  attr_id: number;
  label_en: string;
  label_ar: string;
  parent_id: number | null;
}

export interface Attribute {
  id: number;
  label_en: string;
  label_ar: string;
  type: string;
  sys_name: string;
  selection_type: string;
  options: AttributeOption[];
}

export interface AttributesResponse {
  data: Attribute[];
}

// Fetch attributes from remote API
export async function fetchCarAttributes(): Promise<Attribute[]> {
  const attributesApiBaseUrl = FORSALE_INTEGRATIONS_API_BASE_URL;
  const apiKey = process.env.REACT_APP_FORSALE_API_KEY;
  const apiSecret = process.env.REACT_APP_FORSALE_API_SECRET;
  const response = await axios.post<AttributesResponse>(
    attributesApiBaseUrl + '/v1/integrations/attributes/fetch',
    {
      sys_names: [
        'brand',
        'model',
        'Color-Exterior',
        'Body Type',
        'Year',
        'transmission',
      ],
    },
    {
      headers: {
        'Api-Key': apiKey,
        'Api-Secret': apiSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  );
  return response.data.data;
}

// Simple in-memory cache
let cachedAttributes: Attribute[] | null = null;
let lastFetch: number = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getCarAttributes(forceRefresh = false): Promise<Attribute[]> {
  const now = Date.now();
  if (!forceRefresh && cachedAttributes && now - lastFetch < CACHE_TTL) {
    return cachedAttributes;
  }
  const attrs = await fetchCarAttributes();
  cachedAttributes = attrs;
  lastFetch = now;
  return attrs;
}

// Helper: get options for a sys_name
export function getAttributeOptions(attrs: Attribute[], sysName: string): AttributeOption[] {
  const attr = attrs.find(a => a.sys_name.toLowerCase() === sysName.toLowerCase());
  return attr ? attr.options : [];
}

// Helper: get localized label
export function getOptionLabel(option: AttributeOption, lang: string): string {
  return lang === 'ar' ? option.label_ar : option.label_en;
}

// Helper: get models for a brand
export function getModelsForBrand(attrs: Attribute[], brandId: number): AttributeOption[] {
  const modelAttr = attrs.find(a => a.sys_name.toLowerCase() === 'model');
  if (!modelAttr) return [];
  return modelAttr.options.filter(opt => opt.parent_id === brandId);
} 