import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
//const API_BASE_URL = 'https://booking-api.q84sale.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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

// API Types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignupRequest {
  display_name: string;
  email: string;
  phone: string;
  password: string;
}

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

export interface AuthResponse {
  message: string;
  user_id?: number;
  token?: string;
  user?: User;
}

// API Functions
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  verifyOTP: async (data: OTPRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
};

export const userAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/user');
    return response.data.user;
  },
};

// Utility functions
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Phone validation functions moved to business/phoneValidation.ts

export default api; 