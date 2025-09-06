// src/common/types/api-response.interface.ts
export interface ApiResponse<T> {
  message?: string
  data?: T
}
