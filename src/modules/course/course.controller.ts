import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common"
import {
  CourseDto,
  CourseResponseDto as CourseResponseFromCreate,
} from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { Inject, forwardRef } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { CourseService } from "./course.service"
// import { CourseResponseDto as CourseResponse } from "./dto/course-response.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { Public } from "@/common/decorators/public.decorator"
// import { ApiOperation, ApiParam } from "@nestjs/swagger"
// import { GetCoursesQueryDto } from "./dto/get-courses-query.dto"
// import { NotFoundException } from "@nestjs/common"

@ApiTags("courses")
@Controller("course")
export class CourseController {
  constructor(
    private readonly service: CourseService,
    @Inject(forwardRef(() => ProphetService))
    private readonly prophetService: ProphetService
  ) {}

  @Public()
  @Get()
  async GetFilteredCourses(
    @Query() query: FilterAndSortCoursesDto
  ): Promise<CourseResponseFromCreate[]> {
    const filter = {
      sort_by: query.sort_by,
      price_min: query.price_min,
      price_max: query.price_max,
      horoscope_method: query.horoscope_method,
      horoscope_sector: query.horoscope_sector,
      limit: query.limit,
      offset: query.offset,
    } as FilterAndSortCoursesDto
    return (await this.service.getFilteredCourses(
      filter
    )) as CourseResponseFromCreate[]
  }

  @Public()
  @Get("/byprophet/:prophetId")
  async getCoursesByProphet(
    @Param("prophetId") prophetId: string
  ): Promise<GetCoursesByProphetDto[]> {
    return await this.service.getCoursesByProphetIdCourseList(prophetId)
  }

  @Get("/:id")
  async getCourse(@Param("id") id: string): Promise<CourseDto> {
    return await this.service.getCourse(id)
  }

  @Post("/prophet")
  async createCourse(@Body() body: CourseDto): Promise<CourseDto> {
    return await this.service.createCourse(body)
  }

  // @Get(":accountId")
  // @Public()
  // @ApiOperation({ summary: "Get courses by account ID (public)" })
  // @ApiParam({ name: "accountId", description: "Account ID", type: String })
  // async getCoursesByAccountId(
  //   @Param("accountId") accountId: string,
  //   @Query() query: GetCoursesQueryDto
  // ): Promise<CourseResponseDto[]> {
  //   const prophet = await this.prophetService.getProphetByAccountId(accountId)

  //   if (!prophet?.id) {
  //     throw new NotFoundException("Prophet not found for the provided account")
  //   }

  //   return this.service.getCoursesByProphetIdCourseList(
  //     prophet.id,
  //     query.isActive
  //   )
  // }
}
