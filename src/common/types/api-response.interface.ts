// src/common/types/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}
