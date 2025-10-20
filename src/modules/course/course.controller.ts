import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
  Param,
  Inject,
  forwardRef,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger"
import { CourseService } from "./course.service"
import { CourseResponseDto } from "./dto/course-response.dto"
import { GetCoursesQueryDto } from "./dto/get-courses-query.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { Public } from "@/common/decorators/public.decorator"
import { CreateCourseBodyDto } from "./dto/create-course.dto"
import { FilterCoursesQueryDto } from "./dto/fileter-body.dto"

@ApiTags("Courses")
@Controller("courses")
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => ProphetService))
    private readonly prophetService: ProphetService
  ) {}

  @Get(":accountId")
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
    @Query() query: FilterCoursesQueryDto
  ): Promise<CourseResponseDto[]> {
    const filter = {
      sort_by: query.sort_by,
      price_min: query.price_min,
      price_max: query.price_max,
      horoscope_method: query.horoscope_method,
      horoscope_sector: query.horoscope_sector,
      limit: query.limit,
      offset: query.offset,
    } as FilterCoursesQueryDto
    return await this.courseService.getFilteredCourses(filter)
  }

  @Get("/:id")
  async getCourse(@Param("id") id: string): Promise<CourseResponseDto> {
    return await this.courseService.getCourse(id)
  }

  @Post("/prophet")
  async createCourse(@Body() body: CreateCourseBodyDto): Promise<void> {
    await this.courseService.createCourse(body)
  }
}
