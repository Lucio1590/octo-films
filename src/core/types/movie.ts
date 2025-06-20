import type { Genre } from './genre'

export interface Movie {
  id: number
  documentId: string
  title: string
  description: string
  release_date: string
  average_rating: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  cover_image: string
  background_image: string
  genres?: Genre[]
}
