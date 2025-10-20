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
}
