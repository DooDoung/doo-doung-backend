import { Controller, Get, Param } from "@nestjs/common"
import { ReviewService } from "./review.service"

@Controller("review")
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get("me")
  get() {
    const tmpAccountId = "77338f2877fe4772"
    return this.service.getReviewByAccountId(tmpAccountId)
  }

  @Get("account/:id")
  getById(@Param("id") id: string) {
    return this.service.getReviewByAccountId(id)
  }
}
