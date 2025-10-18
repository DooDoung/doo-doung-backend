import { Injectable, NotFoundException } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseForBookingResponse } from "./interface/course.interface"
import { CourseResponseDto } from "./dto/course-response.dto"
import { CourseActiveResponseDto } from "./dto/course-response.dto"

@Injectable()
export class CourseService {
  constructor(private readonly courseRepo: CourseRepository) {}

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

  async toggleCourseActiveStatus(
    courseId: string
  ): Promise<CourseActiveResponseDto> {
    const course = await this.courseRepo.findById(courseId, {
      id: true,
      isActive: true,
    })
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
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

  async getProphetIdByCourseId(courseId: string): Promise<string> {
    const course = await this.courseRepo.findById(courseId, { prophetId: true })
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }
    return course.prophetId
  }

  async toggleCourseActiveStatusForProphet(
    courseId: string,
    prophetId: string
  ): Promise<CourseActiveResponseDto> {
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
