import { Injectable } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseDto, CourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"

@Injectable()
export class CourseService {
  constructor(private readonly repo: CourseRepository) {}

  async createCourse(data: CourseDto): Promise<CourseResponseDto> {
    return await this.repo.createCourse(data)
  }

  async getCourse(courseId: string): Promise<CourseResponseDto> {
    return await this.repo.getCourse(courseId)
  }

  async getFilteredCourses(
    filter: FilterAndSortCoursesDto
  ): Promise<CourseResponseDto[]> {
    return await this.repo.getFilteredCourses(filter)
  }
}
