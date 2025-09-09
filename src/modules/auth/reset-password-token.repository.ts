// repositories/reset-password-token.repository.ts
import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"

@Injectable()
export class ResetPasswordTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(accountId: string, token: string, expiresAt: Date) {
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
