import { Controller, Get, Param } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { ReviewService } from "./review.service"
import { GetReviewsResponseDto } from "./dto/get-review.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { Public } from "@/common/decorators/public.decorator"

@ApiTags("review")
@Controller("review")
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get("me")
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  @ApiBearerAuth()
  get(@CurrentUser("id") id: string): Promise<GetReviewsResponseDto> {
    return this.service.getReviewByAccountId(id)
  }

  @Get("account/:id")
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  @Public()
  getById(@Param("id") id: string): Promise<GetReviewsResponseDto> {
    return this.service.getReviewByAccountId(id)
  }

  @Get("course/:id")
  @Public()
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  getByCourseId(@Param("id") id: string): Promise<GetReviewsResponseDto> {
    return this.service.getReviewByCourseId(id)
  }
}
