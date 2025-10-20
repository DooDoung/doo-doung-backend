import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"
import { Prisma } from "@prisma/client"
import { NanoidService } from "@/common/utils/nanoid"
import { CourseDto, CourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/fileter-body.dto"

@Injectable()
export class CourseRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nanoid: NanoidService
  ) {}

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
    filter: FilterAndSortCoursesDto
  ): Promise<CourseResponseDto[]> {
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
    const result: CourseResponseDto[] = []
    for (const course of courses) {
      const detailedCourse = await this.getCourse(course.id)
      result.push(detailedCourse)
    }
    return result
  }

  async createCourse(data: CourseDto): Promise<CourseResponseDto> {
    const id = await this.nanoid.generateId()
    await this.prisma.course.create({
      data: {
        id: id,
        prophetId: data.prophetId,
        courseName: data.courseName,
        horoscopeMethodId: data.horoscopeMethodId,
        horoscopeSector: data.horoscopeSector,
        durationMin: data.durationMin,
        price: data.price,
        isActive: data.isActive,
      },
    })
    return this.getCourse(id)
  }

  async getCourse(courseId: string): Promise<CourseResponseDto> {
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
