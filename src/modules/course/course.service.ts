import { Injectable, NotFoundException } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseForBookingResponse } from "./interface/course.interface"
import { CourseResponseDto } from "./dto/course-response.dto"
import { CourseActiveResponseDto } from "./dto/course-response.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { CourseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/fileter-body.dto"

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly prophetService: ProphetService
  ) {}

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

  async getCoursesByProphetId(
    prophetId: string,
    isActive?: boolean
  ): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepo.getCoursesByProphetId(prophetId, {
      id: true,
      courseName: true,
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
      horoscopeSector: course.horoscopeSector,
      durationMin: course.durationMin,
      price: Number(course.price),
      isActive: course.isActive,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }))
  }

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

  async createCourse(data: CourseDto): Promise<CourseResponseDto> {
    return await this.courseRepo.createCourse(data)
  }

  async getCourse(courseId: string): Promise<CourseResponseDto> {
    return await this.courseRepo.getCourse(courseId)
  }

  async getFilteredCourses(
    filter: FilterAndSortCoursesDto
  ): Promise<CourseResponseDto[]> {
    return await this.courseRepo.getFilteredCourses(filter)
  }
}
