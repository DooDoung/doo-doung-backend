// repositories/reset-password-token.repository.ts
import { Injectable, ConflictException } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"

@Injectable()
export class ResetPasswordTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(accountId: string, token: string, expiresAt: Date) {
    const existing = await this.prisma.resetPasswordToken.findFirst({
      where: {
        accountId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    })

    if (existing) {
      const now = new Date()
      const remainingMs = existing.expiresAt.getTime() - now.getTime()
      const remainingMinutes = Math.ceil(remainingMs / (1000 * 60))

      throw new ConflictException(
        `You already requested a password reset. You can try again in ${remainingMinutes} minute(s).`
      )
    }

    return this.prisma.resetPasswordToken.create({
      data: {
        accountId,
        token,
        expiresAt,
      },
    })
  }

  async findValidToken(token: string) {
    return this.prisma.resetPasswordToken.findFirst({
      where: {
        token,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    })
  }

  async markUsed(id: string) {
    return this.prisma.resetPasswordToken.update({
      where: { id },
      data: { usedAt: new Date() },
    })
  }
}
