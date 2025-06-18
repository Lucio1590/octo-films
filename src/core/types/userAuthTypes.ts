export interface UserRole {
  id: number
  documentId: string
  name: string
  description: string
  type: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface User {
  id: number
  documentId?: string
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  role?: UserRole
}

export interface AuthResponse {
  jwt: string
  user: User
}

export interface LoginCredentials {
  identifier: string // email or username
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}
