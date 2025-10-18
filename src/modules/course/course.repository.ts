import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"
import { Prisma } from "@prisma/client"

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById<T extends Prisma.CourseSelect>(
    id: string,
    select: T
  ): Promise<Prisma.CourseGetPayload<{ select: T }> | null> {
    return this.prisma.course.findUnique({
      where: { id },
      select,
    })
  }

  async getCoursesByProphetId<T extends Prisma.CourseSelect>(
    prophetId: string,
    select: T,
    isActive?: boolean
  ): Promise<Prisma.CourseGetPayload<{ select: T }>[]> {
    const whereClause: Prisma.CourseWhereInput = { prophetId }

    if (isActive !== undefined) {
      whereClause.isActive = isActive
    }

    return this.prisma.course.findMany({
      where: whereClause,
      select,
    })
  }

  async toggleCourseActiveStatus(
    courseId: string,
    isActive: boolean
  ): Promise<
    Prisma.CourseGetPayload<{ select: { id: true; isActive: true } }>
  > {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { isActive },
      select: { id: true, isActive: true },
    })
  }
}
