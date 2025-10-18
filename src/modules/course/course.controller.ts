import {
  Controller,
  Get,
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
}
