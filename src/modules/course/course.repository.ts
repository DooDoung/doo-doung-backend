import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"
import { Prisma } from "@prisma/client"
import {
  FilterCoursesQueryDto,
  FilterCourseResponseDto,
} from "./dto/fileter-course.dto"
import { HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

interface CreateCourseBodyData {
  id: string
  prophetId: string
  courseName: string
  horoscopeMethodId: number
  horoscopeSector: HoroscopeSector
  durationMin: number
  price: Decimal
  isActive: boolean
}

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

  async getFilteredCourses(
    filter: FilterCoursesQueryDto
  ): Promise<FilterCourseResponseDto[]> {
    // Build orderBy object based on filter.sort_by
    let orderBy: Prisma.CourseOrderByWithRelationInput

    if (filter.sort_by === "Popular") {
      orderBy = { bookings: { _count: "desc" } }
    } else if (filter.sort_by === "Newest Update") {
      orderBy = { createdAt: "desc" }
    } else if (filter.sort_by === "Oldest Update") {
      orderBy = { createdAt: "asc" }
    } else if (filter.sort_by === "Lowest Price") {
      orderBy = { price: "asc" }
    } else if (filter.sort_by === "Highest Price") {
      orderBy = { price: "desc" }
    } else {
      orderBy = { createdAt: "desc" } // default sort
    }

    const courses = await this.prisma.course.findMany({
      where: {
        price: {
          gte: filter.price_min,
          lte: filter.price_max,
        },
        ...(filter.horoscope_method
          ? { horoscopeMethod: { name: filter.horoscope_method } }
          : {}),
        horoscopeSector: filter.horoscope_sector,
      },
      take: filter.limit,
      skip: filter.offset,
      orderBy: orderBy,
      include: {
        horoscopeMethod: true,
      },
    })
    const result: FilterCourseResponseDto[] = []
    for (const course of courses) {
      const detailedCourse = await this.getCourseWithProphet(course.id)
      result.push(detailedCourse)
    }
    return result
  }

  async createCourse(data: CreateCourseBodyData): Promise<void> {
    await this.prisma.course.create({ data })
  }

  async getCourseWithProphet(
    courseId: string
  ): Promise<FilterCourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        prophetId: true,
        courseName: true,
        horoscopeMethodId: true,
        horoscopeSector: true,
        durationMin: true,
        price: true,
        isActive: true,
      },
    })
    if (!course) throw new Error("Course not found")
    const { accountId, lineId } = (await this.prisma.prophet.findUnique({
      where: {
        id: course?.prophetId,
      },
      select: {
        accountId: true,
        lineId: true,
      },
    })) as { accountId: string; lineId: string }
    if (!accountId) throw new Error("Account not found")
    const { name, lastname } = (await this.prisma.userDetail.findUnique({
      where: {
        accountId: accountId,
      },
      select: {
        name: true,
        lastname: true,
      },
    })) as { name: string; lastname: string }
    if (!name || !lastname) throw new Error("UserDetail not found")
    return { ...course, lineId, name, lastname }
  }
}
