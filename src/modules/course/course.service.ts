import { Injectable, NotFoundException } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CreateCourseDto, GetCourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { CourseForBookingResponse } from "./interface/course.interface"
import { CourseActiveResponseDto } from "./dto/course-response.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { CourseResponseDto } from "./dto/course-response.dto"

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly prophetService: ProphetService,
    private readonly repo: CourseRepository
  ) {}

  async createCourse(
    data: CreateCourseDto,
    accountId: string
  ): Promise<GetCourseResponseDto> {
    const prophet = await this.prophetService.getProphetByAccountId(accountId)
    if (!prophet || !prophet.id) {
      throw new NotFoundException("Prophet not found")
    }
    return await this.repo.createCourse(data, prophet.id)
  }

  async getCourseByCourseId(courseId: string): Promise<GetCourseResponseDto> {
    return await this.repo.getCourse(courseId)
  }

  async getFilteredCourses(
    filter: FilterAndSortCoursesDto
  ): Promise<GetCourseResponseDto[]> {
    return await this.repo.getFilteredCourses(filter)
  }

  async getCourse(courseId: string): Promise<GetCourseResponseDto> {
    return await this.courseRepo.getCourse(courseId)
  }

  async getCourseForBookingById(id: string): Promise<CourseForBookingResponse> {
    const course = await this.repo.findById(id, {
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
    const courses = await this.repo.getCoursesByProphetId(prophetId, {
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

  // async getCoursesByProphetId(
  //   prophetId: string,
  //   isActive?: boolean
  // ): Promise<CourseResponseDto[]> {
  //   const courses = await this.courseRepo.getCoursesByProphetId(prophetId, {
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
    const course = await this.repo.findById(courseId, { prophetId: true })
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
    const course = await this.repo.findById(courseId, {
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
    const result = await this.repo.toggleCourseActiveStatus(courseId, isActive)

    return {
      id: result.id,
      isActive: result.isActive,
    }
  }
}
