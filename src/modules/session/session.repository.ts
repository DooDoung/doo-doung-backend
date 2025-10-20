import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProphetId(prophetId: string) {
    return this.prisma.booking.findMany({
      where: { prophetId },
      include: {
        customer: { include: { account: { include: { userDetail: true } } } },
        course: { include: { horoscopeMethod: true } },
        prophet: {
          include: {
            account: { include: { userDetail: true } },
            txAccounts: true,
          },
        },
        transaction: true,
      },
      orderBy: { startDateTime: "desc" },
    })
  }
}
