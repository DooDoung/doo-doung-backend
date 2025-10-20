import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAllByProphetId(prophetId: string) {
    return this.prisma.booking.findMany({
      where: { prophetId },
      include: {
        customer: {
          include: {
            account: {
              include: {
                userDetail: true,
              },
            },
          },
        },
        prophet: {
          // ✅ Add prophet relation
          include: {
            account: {
              include: {
                userDetail: true,
              },
            },
          },
        },
        course: {
          include: {
            horoscopeMethod: true,
          },
        },
        transaction: true,
        reviews: true,
      },
      orderBy: {
        startDateTime: "desc",
      },
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
            horoscopeMethod: { select: { name: true } },
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
