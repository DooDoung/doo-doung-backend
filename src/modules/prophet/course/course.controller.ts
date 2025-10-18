import { Controller, Patch, Param } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger"
import { CourseService } from "@/modules/course/course.service"
import { CourseActiveResponseDto } from "@/modules/course/dto/course-response.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { ProphetService } from "@/modules/prophet/prophet.service"
import { Roles } from "@/common/decorators/roles.decorator"

@ApiTags("Prophet Courses")
@Controller("prophet/courses")
export class ProphetCourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly prophetService: ProphetService
  ) {}

  @Patch(":courseId/toggle-status")
  @ApiOperation({ summary: "Toggle course active status" })
  @ApiParam({ name: "courseId", description: "Course ID", type: String })
  @ApiBearerAuth()
  @Roles("PROPHET")
  async toggleCourseActiveStatus(
    @CurrentUser("id") accountId: string,
    @Param("courseId") courseId: string
  ): Promise<CourseActiveResponseDto> {
    return await this.courseService.toggleCourseActiveStatus(
      courseId,
      accountId
    )
  }
}
