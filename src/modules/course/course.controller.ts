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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { CourseService } from "./course.service"
import { CourseResponseDto } from "./dto/course-response.dto"
import { GetCoursesQueryDto } from "./dto/get-courses-query.dto"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { Public } from "@/common/decorators/public.decorator"
import { CreateCourseBodyDto } from "./dto/create-course.dto"
import {
  FilterCoursesQueryDto,
  FilterCourseResponseDto,
} from "./dto/fileter-course.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { Decimal } from "@prisma/client/runtime/library"

@ApiTags("courses")
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
  ): Promise<FilterCourseResponseDto[]> {
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
  
  @Public()
  @Get("/:id")
  async getCourse(@Param("id") id: string): Promise<CourseResponseDto> {
    return await this.courseService.getCourseById(id)
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new course for a prophet" })
  @ApiBody({
    description: "Course creation payload",
    type: CreateCourseBodyDto,
  })
  @ApiResponse({ status: 201, description: "Course created successfully" })
  async createCourse(
    @Body() body: CreateCourseBodyDto,
    @CurrentUser("id") id: string
  ): Promise<void> {
    const payload = {
      courseName: body.courseName,
      horoscopeSector: body.horoscopeSector,
      horoscopeMethodId: Number(body.horoscopeMethodId),
      durationMin: Number(body.durationMin),
      price: new Decimal(body.price),
      isActive: body.isActive,
    }
    await this.courseService.createCourse(payload, id)
  }
}
