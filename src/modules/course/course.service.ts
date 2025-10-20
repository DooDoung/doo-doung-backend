import { Injectable, NotFoundException } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseForBookingResponse } from "./interface/course.interface"
import { CourseResponseDto } from "./dto/course-response.dto"
import { CourseActiveResponseDto } from "./dto/course-response.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import {
  FilterCourseResponseDto,
  FilterCoursesQueryDto,
} from "./dto/fileter-course.dto"
import { HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { NanoidService } from "../../common/utils/nanoid"

interface CreateCourseBodyPayload {
  courseName: string
  horoscopeMethodId: number
  horoscopeSector: HoroscopeSector
  durationMin: number
  price: Decimal
  isActive: boolean
}
@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly prophetService: ProphetService,
    private readonly nanoidService: NanoidService
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
      price: course.price,
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

  async createCourse(
    payload: CreateCourseBodyPayload,
    userId: string
  ): Promise<void> {
    const prophetId = await (
      await this.prophetService.getProphetByAccountId(userId)
    ).id
    if (!prophetId) {
      throw new NotFoundException("Prophet not found")
    }
    const id = await this.nanoidService.generateId()
    const createCourseData = { ...payload, prophetId, id }

    await this.courseRepo.createCourse(createCourseData)
  }

  async getCourseById(courseId: string): Promise<CourseResponseDto> {
    const course = await this.courseRepo.findById(courseId, {
      id: true,
      prophetId: true,
      courseName: true,
      horoscopeMethodId: true,
      horoscopeSector: true,
      durationMin: true,
      price: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    })
    if (!course) {
      throw NotFoundException
    }
    return course
  }

  async getFilteredCourses(
    filter: FilterCoursesQueryDto
  ): Promise<FilterCourseResponseDto[]> {
    return await this.courseRepo.getFilteredCourses(filter)
  }
}
