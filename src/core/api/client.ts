import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '../types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1337',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.setupInterceptors()

    // Set initial token if it exists in localStorage
    const token = localStorage.getItem('authToken')
    if (token) {
      this.client.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  }

  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }

        const apiError: ApiError = {
          error: {
            status: error.response?.status || 500,
            name: error.response?.data?.error?.name || 'Unknown Error',
            message: error.response?.data?.error?.message || error.message,
            details: error.response?.data?.error?.details || {},
          },
        }

        return Promise.reject(apiError)
      },
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  public setAuthToken(token: string): void {
    localStorage.setItem('authToken', token)
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  public removeAuthToken(): void {
    localStorage.removeItem('authToken')
    delete this.client.defaults.headers.common.Authorization
  }
}

export const apiClient = new ApiClient()
