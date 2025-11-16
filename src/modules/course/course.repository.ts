import { NanoidService } from "@/common/utils/nanoid"
import { PrismaService } from "@/db/prisma.service"
import { Injectable } from "@nestjs/common"
import { GetCourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { Prisma, HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { CreateCourseInterface } from "./interface/create-course.interface"

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
          ? { horoscopeMethod: filter.horoscope_method }
          : {}),
        horoscopeSector: filter.horoscope_sector,
      },
      take: filter.limit,
      skip: filter.offset,
      orderBy: orderBy,
      select: {
        id: true,
        prophetId: true,
        courseName: true,
        courseDescription: true,
        horoscopeMethod: true,
        horoscopeSector: true,
        durationMin: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        prophet: {
          select: {
            lineId: true,
            accountId: true,
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
        },
      },
    })

    return courses.map(course => {
      const { prophet, horoscopeMethod, createdAt, updatedAt, ...restCourse } =
        course

      if (!prophet?.account?.userDetail) {
        throw new Error("Prophet or UserDetail not found")
      }

      return {
        ...restCourse,
        horoscopeMethod: horoscopeMethod ?? null,
        lineId: prophet.lineId,
        name: prophet.account.userDetail.name,
        lastname: prophet.account.userDetail.lastname,
      }
    })
  }

  async createCourse(
    data: CreateCourseInterface,
    prophetId: string
  ): Promise<GetCourseResponseDto> {
    const id = await this.nanoid.generateId()
    const course = await this.prisma.course.create({
      data: {
        id: id,
        prophetId: prophetId,
        courseName: data.courseName,
        courseDescription: data.courseDescription,
        horoscopeMethod: data.horoscopeMethod,
        horoscopeSector: data.horoscopeSector,
        durationMin: data.durationMin,
        price: data.price,
        isActive: true,
      },
      select: {
        id: true,
        prophetId: true,
        courseName: true,
        courseDescription: true,
        horoscopeMethod: true,
        horoscopeSector: true,
        durationMin: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        prophet: {
          select: {
            lineId: true,
            accountId: true,
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
        },
      },
    })

    if (!course.prophet?.accountId) throw new Error("Account not found")
    if (
      !course.prophet?.account?.userDetail?.name ||
      !course.prophet?.account?.userDetail?.lastname
    ) {
      throw new Error("UserDetail not found")
    }

    const { prophet, horoscopeMethod, createdAt, updatedAt, ...restCourse } =
      course
    return {
      ...restCourse,
      horoscopeMethod: horoscopeMethod ?? null,
      lineId: prophet.lineId,
      name: prophet.account!.userDetail!.name,
      lastname: prophet.account!.userDetail!.lastname,
    }
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
        horoscopeMethod: true,
        horoscopeSector: true,
        durationMin: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        prophet: {
          select: {
            lineId: true,
            accountId: true,
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
        },
      },
    })

    if (!course) throw new Error("Course not found")
    if (!course.prophet?.accountId) throw new Error("Account not found")
    if (
      !course.prophet?.account?.userDetail?.name ||
      !course.prophet?.account?.userDetail?.lastname
    ) {
      throw new Error("UserDetail not found")
    }

    const { prophet, horoscopeMethod, createdAt, updatedAt, ...restCourse } =
      course
    return {
      ...restCourse,
      horoscopeMethod: horoscopeMethod ?? null,
      lineId: prophet.lineId,
      name: prophet.account!.userDetail!.name,
      lastname: prophet.account!.userDetail!.lastname,
    }
  }

  async getCoursesByProphetIdCourseList(
    prophetId: string
  ): Promise<GetCoursesByProphetDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { prophetId: prophetId, isActive: true },
      include: {
        bookings: {
          select: {
            reviews: {
              select: {
                score: true,
              },
            },
          },
        },
        prophet: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (courses.length === 0) {
      // Check if prophet exists when no courses found
      const prophet = await this.prisma.prophet.findUnique({
        where: { id: prophetId },
        select: { id: true },
      })
      if (!prophet) throw new Error("Prophet not found")
    }

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
        prophetName: course.prophet?.account?.userDetail?.name || "",
        prophetLastname: course.prophet?.account?.userDetail?.lastname || "",
        isPublic: true, // Assuming all active courses are public by default
        price: course.price.toNumber(),
        rating: rating ? parseFloat(rating.toFixed(1)) : null,
        horoscopeSector: course.horoscopeSector,
        durationMin: course.durationMin,
        horoscopeMethod: course.horoscopeMethod,
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
    const course = await this.prisma.course.update({
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
      select: {
        id: true,
        prophetId: true,
        courseName: true,
        courseDescription: true,
        horoscopeMethod: true,
        horoscopeSector: true,
        durationMin: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        prophet: {
          select: {
            lineId: true,
            accountId: true,
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
        },
      },
    })

    if (!course.prophet?.accountId) throw new Error("Account not found")
    if (
      !course.prophet?.account?.userDetail?.name ||
      !course.prophet?.account?.userDetail?.lastname
    ) {
      throw new Error("UserDetail not found")
    }

    const { prophet, horoscopeMethod, createdAt, updatedAt, ...restCourse } =
      course
    return {
      ...restCourse,
      horoscopeMethod: horoscopeMethod ?? null,
      lineId: prophet.lineId,
      name: prophet.account!.userDetail!.name,
      lastname: prophet.account!.userDetail!.lastname,
    }
  }
}
