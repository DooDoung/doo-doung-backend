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
      updatedAt: Date
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
        updatedAt: true,
      },
    })
  }

  findByCourseId(courseId: string): Promise<
    Array<{
      score: number
      description: string | null
      booking: {
        course: { courseName: string }
        customer: { accountId: string }
      }
      updatedAt: Date
    }>
  > {
    return this.prisma.review.findMany({
      where: {
        booking: {
          courseId: courseId,
        },
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
            customer: {
              select: {
                accountId: true,
              },
            },
          },
        },
        updatedAt: true,
      },
    })
  }
}
