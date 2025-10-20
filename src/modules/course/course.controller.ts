import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common"
import {
  GetCourseResponseDto as CourseResponseFromCreate,
  CreateCourseDto,
  GetCourseResponseDto,
} from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { GetCoursesByProphetDto } from "./dto/get-courses-by-prophet.dto"
import { Inject, forwardRef } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { CourseService } from "./course.service"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { Public } from "@/common/decorators/public.decorator"
import { ApiOperation, ApiParam } from "@nestjs/swagger"
import { GetCoursesQueryDto } from "./dto/get-courses-query.dto"
import { NotFoundException } from "@nestjs/common"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { CourseResponseDto } from "./dto/course-response.dto"

@ApiTags("course")
@Controller("course")
export class CourseController {
  constructor(
    private readonly service: CourseService,
    @Inject(forwardRef(() => ProphetService))
    private readonly prophetService: ProphetService
  ) {}

  @Get("/prophet/:accountId")
  @Public()
  @ApiOperation({ summary: "Get courses by account ID (public)" })
  @ApiParam({ name: "accountId", description: "Account ID", type: String })
  async getCoursesByAccountId(
    @Param("accountId") accountId: string,
    @Query() query: GetCoursesQueryDto
  ): Promise<CourseResponseDto[]> {
    const prophet = await this.prophetService.getProphetByAccountId(accountId)

    if (!prophet?.id) {
      throw new NotFoundException("Prophet not found for the provided account")
    }

    return this.service.getCoursesByProphetId(prophet.id, query.isActive)
  }

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
  @Get("/prophet/:prophetId")
  async getCoursesByProphet(
    @Param("prophetId") prophetId: string
  ): Promise<GetCoursesByProphetDto[]> {
    return await this.service.getCoursesByProphetIdCourseList(prophetId)
  }

  @Get("/:id")
  @Public()
  async getCourse(@Param("id") id: string): Promise<GetCourseResponseDto> {
    return await this.service.getCourseByCourseId(id)
  }

  @Post("/prophet")
  @ApiBearerAuth()
  async createCourse(
    @Body() body: CreateCourseDto,
    @CurrentUser("id") accountId: string
  ): Promise<GetCourseResponseDto> {
    return await this.service.createCourse(body, accountId)
  }
}
