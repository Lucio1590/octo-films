import type { Review } from '../core/types'
import { apiClient } from '../core/api/client'

export interface CreateReviewData {
  title: string
  body: string
  rating: number
  username: string
  movie: string // documentId of the movie
}

/**
 * ReviewsService provides methods to interact with the reviews API endpoints.
 */
export class ReviewsService {
  /**
   * Creates a new review for a movie.
   * @param reviewData - The review data to create.
   */
  static async createReview(reviewData: CreateReviewData): Promise<{ data: Review }> {
    return apiClient.post<{ data: Review }>('/api/reviews', {
      data: reviewData,
    })
  }

  /**
   * Updates an existing review.
   * @param documentId - The documentId of the review to update.
   * @param reviewData - The updated review data.
   */
  static async updateReview(documentId: string, reviewData: Partial<CreateReviewData>): Promise<{ data: Review }> {
    return apiClient.put<{ data: Review }>(`/api/reviews/${documentId}`, {
      data: reviewData,
    })
  }

  /**
   * Deletes a review.
   * @param documentId - The documentId of the review to delete.
   */
  static async deleteReview(documentId: string): Promise<void> {
    return apiClient.delete(`/api/reviews/${documentId}`)
  }
}
