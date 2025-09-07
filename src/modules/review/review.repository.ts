import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCustomerId(customerId: string): Promise<
    Array<{
      score: number
      description: string | null
      booking: { course: { courseName: string } }
    }>
  > {
    return this.prisma.review.findMany({
      where: {
        customerId: customerId,
      },
      select: {
        score: true,
        description: true,
        booking: {
          select: {
            course: {
              select: {
                courseName: true,
              },
            },
          },
        },
      },
    })
  }
}
