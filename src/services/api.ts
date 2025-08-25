import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';
import type { ApiError } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          store.dispatch(logout());
        }

        if (error.response) {
          const apiError: ApiError = {
            message: error.response.data?.message || 'An error occurred',
            status: error.response.status,
            data: error.response.data,
          };
          return Promise.reject(apiError);
        }

        return Promise.reject({
          message: 'Network error - please check your connection',
        } as ApiError);
      }
    );
  }

  public async get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config);
  }

  public async post<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config);
  }

  public async delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config);
  }
}

export const apiService = new ApiService();
