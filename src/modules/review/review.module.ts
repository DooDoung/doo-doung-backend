import { Module } from "@nestjs/common"
import { ReviewService } from "./review.service"
import { ReviewRepository } from "./review.repository"
import { CustomerModule } from "../customer/customer.module"
import { ReviewController } from "./review.controller"

@Module({
  imports: [CustomerModule],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
