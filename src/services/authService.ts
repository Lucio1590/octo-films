import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../core/types'
import { apiClient } from '../core/api/client'

/*
NOTE: this is a class, the choice was made so a singleton can be instantiated an be the single surce of truth
*/
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/local', credentials)

    if (response.jwt) {
      apiClient.setAuthToken(response.jwt)
    }

    return response
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/local/register', credentials)

    if (response.jwt) {
      apiClient.setAuthToken(response.jwt)
    }

    return response
  }

  static async logout(): Promise<void> {
    apiClient.removeAuthToken()
  }

  static async me(): Promise<AuthResponse['user']> {
    const response = await apiClient.get<AuthResponse['user']>('/api/users/me?populate=role')
    return response
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken')
  }
}
