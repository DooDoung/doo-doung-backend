import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { ReviewDto } from "./dto/get-review.dto"
import { NanoidService } from "@/common/utils/nanoid"

@Injectable()
export class ReviewRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nanoid: NanoidService
  ) {}

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
  async create(body: {
    customerId: string
    score: number
    description?: string | null
    bookingId: string
  }): Promise<ReviewDto> {
    const id = await this.nanoid.generateId()
    return this.prisma.review.create({
      data: {
        id: id,
        customerId: body.customerId,
        score: body.score,
        description: body.description,
        bookingId: body.bookingId,
      },
    }) as unknown as Promise<ReviewDto>
  }
}
