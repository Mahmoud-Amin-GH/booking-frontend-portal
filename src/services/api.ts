import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://apis.q84sale.com/api';
const FORSALE_SERVICES_API_BASE_URL = process.env.REACT_APP_FORSALE_SERVICES_API_BASE_URL || 'https://services.q84sale.com/api';
const FORSALE_INTEGRATIONS_API_BASE_URL = process.env.REACT_APP_FORSALE_INTEGRATIONS_API_BASE_URL || 'https://integrations.q84sale.com/api';
const basePath = '/v1/booking';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Normalize various token shapes into a plain string JWT
const normalizeToken = (raw: any): string | null => {
  if (!raw) return null;
  if (typeof raw === 'string') return raw.trim();
  // Handle cases where token is nested in an object
  if (typeof raw === 'object') {
    const possible = raw.access_token || raw.token || raw.accessToken || raw.access;
    if (typeof possible === 'string') return possible.trim();
  }
  return null;
};

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('auth_token');
    const token = normalizeToken(stored);
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    } else {
      // Ensure we don't send a bad header like "Bearer [object Object]"
      if ((config.headers as any).Authorization) delete (config.headers as any).Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try { localStorage.removeItem('auth_token'); } catch {}
      if (typeof window !== 'undefined' && window.location.pathname !== '/login-4sale') {
        window.location.href = '/login-4sale';
      }
    }
    return Promise.reject(error);
  }
);

// --- NEW/UPDATED API TYPES ---

export interface LoginRequest {
  phone: string; // e.g., "96500000444"
  password: string;
}

export interface RemoteUser {
  id: number;
  name: string;
  phone: string;
  roles: string[];
  // Add other fields from the remote API as needed
}

export interface RemoteAuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: RemoteUser;
}

// --- DEPRECATED/LEGACY API TYPES ---

/** @deprecated The local signup flow is no longer used. */
export interface SignupRequest {
  display_name: string;
  email: string;
  phone: string;
  password: string;
}

/** @deprecated The OTP flow is no longer used. */
export interface OTPRequest {
  phone: string;
  code: string;
}

export interface User {
  id: number;
  display_name: string;
  email: string;
  phone: string;
  is_verified: boolean;
  reason?: string | null;
  created_at: string;
}


// This is the response format our frontend components expect.
// We will adapt the remote response to this format.
export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
  user_id?: number; // Keep for backward compatibility if needed, otherwise remove
}


// --- API FUNCTIONS ---

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Note: The phone number must be in the format "965..." without '+'
    const response = await api.post(FORSALE_SERVICES_API_BASE_URL + '/v1/users/auth/login', {
      ...data,
      phone: data.phone.replace(/\D/g, ''), // Ensure no special characters
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Device-Id': '13db23c7d5a166b3', // TODO: get device id from the user's device
      },
    });

    // Handle services that nest data under a `data` key
    const raw = response.data as any;
    const payload = raw?.data ?? raw;

    // Token field may vary
    const accessToken = payload.access_token || payload.token || payload.accessToken || payload.access;
    const tokenString = normalizeToken(accessToken);

    const adaptedResponse: AuthResponse = {
      message: payload.message,
      token: tokenString || undefined,
      user: payload.user ? {
        id: payload.user.id,
        display_name: payload.user.name || payload.user.display_name || '',
        phone: payload.user.phone,
        email: payload.user.email || '',
        is_verified: true,
        created_at: new Date().toISOString(),
      } : undefined,
      user_id: payload.user ? payload.user.id : undefined,
    };

    if (tokenString) {
      localStorage.setItem('auth_token', tokenString);
    }

    return adaptedResponse;
  },

  /**
   * @deprecated This function is part of the old local auth system and should not be used.
   * The new system uses a remote authentication service.
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    console.warn("DEPRECATED: authAPI.signup should no longer be used.");
    // Optionally, you can throw an error to catch this at runtime during development
    // throw new Error("authAPI.signup is deprecated.");
    return Promise.reject("Signup is deprecated.");
  },

  /**
   * @deprecated This function is part of the old local auth system and should not be used.
   * The new system uses a remote authentication service.
   */
  verifyOTP: async (data: OTPRequest): Promise<AuthResponse> => {
    console.warn("DEPRECATED: authAPI.verifyOTP should no longer be used.");
    return Promise.reject("OTP verification is deprecated.");
  },
};

export const userAPI = {} as const;


// --- UTILITY FUNCTIONS ---

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export default api;
export { basePath, FORSALE_SERVICES_API_BASE_URL, FORSALE_INTEGRATIONS_API_BASE_URL };
