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
        course: true,
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

  async findById(sessionId: string) {
    return this.prisma.booking.findUnique({
      where: { id: sessionId },
      include: {
        course: {
          select: {
            courseName: true,
            horoscopeSector: true,
            horoscopeMethod: true,
          },
        },
        prophet: {
          select: {
            account: {
              select: {
                username: true,
                userDetail: {
                  select: { name: true, lastname: true, profileUrl: true },
                },
              },
            },
            txAccounts: {
              where: { isDefault: true },
              select: { accountName: true, accountNumber: true, bank: true },
            },
          },
        },
        customer: {
          select: {
            account: {
              select: {
                username: true,
                userDetail: { select: { name: true, lastname: true } },
              },
            },
          },
        },
        transaction: true,
      },
    })
  }
}
