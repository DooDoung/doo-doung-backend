import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Param,
  Inject,
  forwardRef,
  Post,
  Body,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from "@nestjs/swagger"
import { CourseService } from "./course.service"
import { CourseResponseDto } from "./dto/course-response.dto"
import { GetCoursesQueryDto } from "./dto/get-courses-query.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { Public } from "@/common/decorators/public.decorator"
import { CreateCourseDto, GetCourseResponseDto } from "./dto/create-course.dto"
import { FilterAndSortCoursesDto } from "./dto/sort-and-filter.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"

@ApiTags("Courses")
@Controller("courses")
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
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

    return this.courseService.getCoursesByProphetId(prophet.id, query.isActive)
  }

  @Public()
  @Get()
  async GetFilteredCourses(
    @Query() query: FilterAndSortCoursesDto
  ): Promise<GetCourseResponseDto[]> {
    const filter = {
      sort_by: query.sort_by,
      price_min: query.price_min,
      price_max: query.price_max,
      horoscope_method: query.horoscope_method,
      horoscope_sector: query.horoscope_sector,
      limit: query.limit,
      offset: query.offset,
    } as FilterAndSortCoursesDto
    return await this.courseService.getFilteredCourses(filter)
  }

  @Get("/:id")
  @Public()
  async getCourse(@Param("id") id: string): Promise<GetCourseResponseDto> {
    return await this.courseService.getCourseByCourseId(id)
  }

  @Post("/prophet")
  @ApiBearerAuth()
  async createCourse(
    @Body() body: CreateCourseDto,
    @CurrentUser("id") accountId: string
  ): Promise<GetCourseResponseDto> {
    return await this.courseService.createCourse(body, accountId)
  }
}
