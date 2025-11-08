import { Injectable, NotFoundException } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CreateCourseDto, GetCourseResponseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { CourseForBookingResponse } from "./interface/course.interface"
import { CourseActiveResponseDto } from "./dto/course-response.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { CourseResponseDto } from "./dto/course-response.dto"
import { Decimal } from "@prisma/client/runtime/library"

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly prophetService: ProphetService
  ) {}

  async createCourse(
    data: CreateCourseDto,
    accountId: string
  ): Promise<GetCourseResponseDto> {
    const prophet = await this.prophetService.getProphetByAccountId(accountId)
    if (!prophet || !prophet.id) {
      throw new NotFoundException("Prophet not found")
    }
    const courseNameSlug = data.courseName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    const horoscopeMethod = await this.courseRepo.createHoroscopeMethod(
      data.courseName,
      courseNameSlug
    )
    const courseData = {
      courseName: data.courseName,
      courseDescription: data.courseDescription,
      horoscopeMethodId: horoscopeMethod.id,
      horoscopeSector: data.horoscopeSector,
      durationMin: data.durationMin,
      price: data.price,
    }
    return await this.courseRepo.createCourse(courseData, prophet.id)
  }

  async updateCourse(
    courseId: string,
    data: UpdateCourseDto,
    accountId: string
  ): Promise<GetCourseResponseDto> {
    // Verify the course belongs to this prophet
    const course = await this.courseRepo.findById(courseId, {
      prophetId: true,
    })
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    const prophet = await this.prophetService.getProphetByAccountId(accountId)
    if (!prophet || !prophet.id || course.prophetId !== prophet.id) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found or access denied`
      )
    }

    return await this.courseRepo.updateCourse(courseId, {
      courseName: data.courseName,
      courseDescription: data.courseDescription,
      horoscopeSector: data.horoscopeSector,
      durationMin: data.durationMin,
      price: data.price ? new Decimal(String(data.price)) : undefined,
    })
  }

  async getCourseByCourseId(courseId: string): Promise<GetCourseResponseDto> {
    return await this.courseRepo.getCourse(courseId)
  }

  async getFilteredCourses(
    filter: FilterAndSortCoursesDto
  ): Promise<GetCourseResponseDto[]> {
    return await this.courseRepo.getFilteredCourses(filter)
  }

  async getCourse(courseId: string): Promise<GetCourseResponseDto> {
    return await this.courseRepo.getCourse(courseId)
  }

  async getCourseForBookingById(id: string): Promise<CourseForBookingResponse> {
    const course = await this.courseRepo.findById(id, {
      prophetId: true,
      price: true,
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }

    const res: CourseForBookingResponse = {
      prophetId: course.prophetId,
      price: course.price,
    }
    return res
  }

  async getCoursesByProphetIdCourseList(
    prophetId: string
  ): Promise<GetCoursesByProphetDto[]> {
    return await this.courseRepo.getCoursesByProphetIdCourseList(prophetId)
  }

  async getCoursesByProphetId(
    prophetId: string,
    isActive?: boolean
  ): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepo.getCoursesByProphetId(prophetId, {
      id: true,
      courseName: true,
      courseDescription: true,
      horoscopeMethod: true,
      horoscopeSector: true,
      durationMin: true,
      price: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    })

    // Filter by isActive if specified
    const filteredCourses =
      isActive !== undefined
        ? courses.filter(course => course.isActive === isActive)
        : courses

    return filteredCourses.map(course => ({
      id: course.id,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      horoscopeMethod: course.horoscopeMethod.name,
      horoscopeSector: course.horoscopeSector,
      durationMin: course.durationMin,
      price: Number(course.price),
      isActive: course.isActive,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }))
  }

  // async getCoursesByProphetId(
  //   prophetId: string,
  //   isActive?: boolean
  // ): Promise<CourseResponseDto[]> {
  //   const courses = await this.coursecourseRepo.getCoursesByProphetId(prophetId, {
  //     id: true,
  //     courseName: true,
  //     horoscopeSector: true,
  //     durationMin: true,
  //     price: true,
  //     isActive: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   })

  //   // Filter by isActive if specified
  //   const filteredCourses =
  //     isActive !== undefined
  //       ? courses.filter(course => course.isActive === isActive)
  //       : courses

  //   return filteredCourses.map(course => ({
  //     id: course.id,
  //     courseName: course.courseName,
  //     horoscopeSector: course.horoscopeSector,
  //     durationMin: course.durationMin,
  //     price: Number(course.price),
  //     isActive: course.isActive,
  //     createdAt: course.createdAt,
  //     updatedAt: course.updatedAt,
  //   }))
  // }

  async getProphetIdByCourseId(courseId: string): Promise<string> {
    const course = await this.courseRepo.findById(courseId, { prophetId: true })
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }
    return course.prophetId
  }

  async toggleCourseActiveStatus(
    courseId: string,
    accountId: string
  ): Promise<CourseActiveResponseDto> {
    const prophetId = await (
      await this.prophetService.getProphetByAccountId(accountId)
    ).id
    if (!prophetId) {
      throw new NotFoundException("Prophet not found")
    }
    const course = await this.courseRepo.findById(courseId, {
      id: true,
      prophetId: true,
      isActive: true,
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    if (course.prophetId !== prophetId) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found or access denied`
      )
    }

    const isActive = !course.isActive
    const result = await this.courseRepo.toggleCourseActiveStatus(
      courseId,
      isActive
    )

    return {
      id: result.id,
      isActive: result.isActive,
    }
  }
}
