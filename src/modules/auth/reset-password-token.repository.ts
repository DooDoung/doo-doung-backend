import { Injectable, ConflictException } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"
import { ResetPasswordToken } from "./interfaces/reset-password-token.interface"

@Injectable()
export class ResetPasswordTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    accountId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    const existing = await this.prisma.resetPasswordToken.findFirst({
      where: {
        accountId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" }, // latest token first
    })

    if (existing) {
      const now = new Date()
      const ageMs = now.getTime() - existing.createdAt.getTime()
      const ageMinutes = ageMs / (1000 * 60)

      if (ageMinutes < 1) {
        // Too soon → reject
        const remainingSeconds = Math.ceil(60 - ageMs / 1000)
        throw new ConflictException(
          `You already requested a password reset. Please wait ${remainingSeconds} second(s) before trying again`
        )
      }

      // Otherwise invalidate the old one
      await this.prisma.resetPasswordToken.update({
        where: { id: existing.id },
        data: { usedAt: new Date() },
      })
    }

    await this.prisma.resetPasswordToken.create({
      data: { accountId, token, expiresAt },
    })
  }

  async findToken(token: string): Promise<ResetPasswordToken | null> {
    return this.prisma.resetPasswordToken.findUnique({
      where: { token },
    })
  }

  async findValidToken(token: string): Promise<ResetPasswordToken | null> {
    return this.prisma.resetPasswordToken.findFirst({
      where: {
        token,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    })
  }

  async markUsed(id: string): Promise<void> {
    await this.prisma.resetPasswordToken.update({
      where: { id },
      data: { usedAt: new Date() },
    })
  }
}
