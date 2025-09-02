export interface LoginResult {
  user: { id: string; username: string; email: string; role: string }
  accessToken: string
  tokenType: "Bearer"
  expiresAt: number
}
