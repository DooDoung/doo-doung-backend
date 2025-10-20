import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { CourseService } from "./course.service"
import { CourseDto, CourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { Public } from "@/common/decorators/public.decorator"

@ApiTags("courses")
@Controller("course")
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Public()
  @Get()
  async GetFilteredCourses(
    @Query() query: FilterAndSortCoursesDto
  ): Promise<CourseResponseDto[]> {
    const filter = {
      sort_by: query.sort_by,
      price_min: query.price_min,
      price_max: query.price_max,
      horoscope_method: query.horoscope_method,
      horoscope_sector: query.horoscope_sector,
      limit: query.limit,
      offset: query.offset,
    } as FilterAndSortCoursesDto
    return await this.service.getFilteredCourses(filter)
  }

  @Public()
  @Get("/byprophet/:prophetId")
  async getCoursesByProphet(
    @Param("prophetId") prophetId: string
  ): Promise<GetCoursesByProphetDto[]> {
    return await this.service.getCoursesByProphetId(prophetId)
  }

  @Get("/:id")
  async getCourse(@Param("id") id: string): Promise<CourseDto> {
    return await this.service.getCourse(id)
  }

  @Post("/prophet")
  async createCourse(@Body() body: CourseDto): Promise<CourseDto> {
    return await this.service.createCourse(body)
  }
}
