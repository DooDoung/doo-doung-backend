import { Controller, Get, Param } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { ReviewService } from "./review.service"
import { GetReviewsResponseDto } from "./dto/get-review.dto"

@ApiTags("review")
@Controller("review")
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get("me")
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  get(): Promise<GetReviewsResponseDto> {
    const tmpAccountId = "77338f2877fe4772"
    return this.service.getReviewByAccountId(tmpAccountId)
  }

  @Get("account/:id")
  @ApiOkResponse({
    type: GetReviewsResponseDto,
  })
  getById(@Param("id") id: string): Promise<GetReviewsResponseDto> {
    return this.service.getReviewByAccountId(id)
  }
}
