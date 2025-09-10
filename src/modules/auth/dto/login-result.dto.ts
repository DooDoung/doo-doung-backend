export interface LoginResultDTO {
  user: { id: string; username: string; email: string; role: string }
  accessToken: string
  expiresAt: number
}
