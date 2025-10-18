import {
  Controller,
  NotFoundException,
  Patch,
  Param,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger"
import { CourseService } from "@/modules/course/course.service"
import { CourseActiveResponseDto } from "@/modules/course/dto/course-response.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { ProphetService } from "@/modules/prophet/prophet.service"

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
  async toggleCourseActiveStatus(
    @CurrentUser("id") accountId: string,
    @Param("courseId") courseId: string
  ): Promise<CourseActiveResponseDto> {
    try {
      // Get the current user's prophet ID
      const prophet = await this.prophetService.getProphetByAccountId(accountId)

      if (!prophet?.id) {
        throw new NotFoundException("Prophet not found for the current user")
      }

      return await this.courseService.toggleCourseActiveStatusForProphet(
        courseId,
        prophet.id
      )
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error
      }
      throw new InternalServerErrorException(
        "Unable to process request. Please try again later."
      )
    }
  }
}
