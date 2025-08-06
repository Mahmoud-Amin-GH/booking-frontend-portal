import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
//const API_BASE_URL = 'https://booking-api.q84sale.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Device-Id': '13db23c7d5a166b3', // Static Device-Id as per the curl example
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
  status: string;
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
    const response = await api.post<RemoteAuthResponse>('https://dev-services.q84sale.com/api/v1/users/auth/login', {
      ...data,
      phone: data.phone.replace(/\D/g, ''), // Ensure no special characters
    });

    // Adapt the remote response to the format expected by the frontend
    const adaptedResponse: AuthResponse = {
      message: response.data.message,
      token: response.data.access_token,
      user: {
        id: response.data.user.id,
        display_name: response.data.user.name,
        phone: response.data.user.phone,
        email: '', // Remote API doesn't provide email, set to empty
        is_verified: true, // Assume verified if login is successful
        status: 'active', // Assume active
        created_at: new Date().toISOString(),
      },
      user_id: response.data.user.id,
    };

    if (adaptedResponse.token) {
      localStorage.setItem('auth_token', adaptedResponse.token);
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

export const userAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/auth/me');

    // The remote /me endpoint might return a different structure
    // Adapt it to the existing `User` type
    const remoteUser = response.data.user; // Assuming the user object is nested under 'user'
    
    return {
      id: remoteUser.id,
      display_name: remoteUser.name,
      phone: remoteUser.phone,
      email: '', // Or handle if available
      is_verified: true,
      status: 'active',
      created_at: remoteUser.created_at || new Date().toISOString(),
    };
  },
};


// --- UTILITY FUNCTIONS ---

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export default api;
