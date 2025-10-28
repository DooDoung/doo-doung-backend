import { NanoidService } from "@/common/utils/nanoid"
import { PrismaService } from "@/db/prisma.service"
import { Injectable } from "@nestjs/common"
import { CreateCourseDto, GetCourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { Prisma, HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

@Injectable()
export class CourseRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nanoid: NanoidService
  ) {}

  async getFilteredCourses(
    filter: FilterAndSortCoursesDto
  ): Promise<GetCourseResponseDto[]> {
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
    const result: GetCourseResponseDto[] = []
    for (const course of courses) {
      const detailedCourse = await this.getCourse(course.id)
      result.push(detailedCourse)
    }
    return result
  }

  async createCourse(
    data: CreateCourseDto,
    prophetId: string
  ): Promise<GetCourseResponseDto> {
    const id = await this.nanoid.generateId()
    await this.prisma.course.create({
      data: {
        id: id,
        prophetId: prophetId,
        courseName: data.courseName,
        courseDescription: data.courseDescription,
        horoscopeMethodId: data.horoscopeMethodId,
        horoscopeSector: data.horoscopeSector,
        durationMin: data.durationMin,
        price: data.price,
        isActive: true,
      },
    })
    return this.getCourse(id)
  }

  async getCourse(courseId: string): Promise<GetCourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        prophetId: true,
        courseName: true,
        courseDescription: true,
        horoscopeMethodId: true,
        horoscopeSector: true,
        durationMin: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
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

  async getCoursesByProphetIdCourseList(
    prophetId: string
  ): Promise<GetCoursesByProphetDto[]> {
    const prophet = await this.prisma.prophet.findUnique({
      where: { id: prophetId },
      select: {
        id: true,
        account: {
          select: {
            userDetail: {
              select: {
                name: true,
                lastname: true,
              },
            },
          },
        },
      },
    })

    if (!prophet) throw new Error("Prophet not found")

    const courses = await this.prisma.course.findMany({
      where: { prophetId: prophetId, isActive: true },
      include: {
        horoscopeMethod: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
        bookings: {
          select: {
            reviews: {
              select: {
                score: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return courses.map(course => {
      // Calculate average rating from reviews
      let totalScore = 0
      let reviewCount = 0
      course.bookings.forEach(booking => {
        booking.reviews.forEach(review => {
          totalScore += review.score
          reviewCount++
        })
      })
      const rating = reviewCount > 0 ? totalScore / reviewCount : null

      return {
        id: course.id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        prophetName: prophet.account?.userDetail?.name || "",
        prophetLastname: prophet.account?.userDetail?.lastname || "",
        isPublic: true, // Assuming all active courses are public by default
        price: course.price.toNumber(),
        rating: rating ? parseFloat(rating.toFixed(1)) : null,
        horoscopeSector: course.horoscopeSector,
        durationMin: course.durationMin,
        horoscopeMethodId: course.horoscopeMethodId,
        methodSlug: course.horoscopeMethod?.slug || "",
        methodName: course.horoscopeMethod?.name || "",
        createdAt: course.createdAt,
        isActive: course.isActive,
      }
    })
  }

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

  async updateCourse(
    courseId: string,
    data: {
      courseName?: string
      courseDescription?: string
      horoscopeSector?: string | HoroscopeSector
      durationMin?: number
      price?: Decimal | number
    }
  ): Promise<GetCourseResponseDto> {
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        ...(data.courseName && { courseName: data.courseName }),
        ...(data.courseDescription && {
          courseDescription: data.courseDescription,
        }),
        ...(data.horoscopeSector && {
          horoscopeSector: data.horoscopeSector as HoroscopeSector,
        }),
        ...(data.durationMin && { durationMin: data.durationMin }),
        ...(data.price !== undefined && {
          price: new Decimal(String(data.price)),
        }),
      },
    })
    return this.getCourse(courseId)
  }
}
