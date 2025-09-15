import { Controller, Get, Param } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { ReviewService } from "./review.service"
import { GetReviewsResponseDto } from "./dto/get-review.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"

@ApiTags("review")
@Controller("review")
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get("me")
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  get(@CurrentUser("id") id: string): Promise<GetReviewsResponseDto> {
    return this.service.getReviewByAccountId(id)
  }

  @Get("account/:id")
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  getById(@Param("id") id: string): Promise<GetReviewsResponseDto> {
    return this.service.getReviewByAccountId(id)
  }
}
