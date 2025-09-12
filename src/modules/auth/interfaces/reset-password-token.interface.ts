export interface ResetPasswordToken {
  id: string
  accountId: string
  token: string
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
}
