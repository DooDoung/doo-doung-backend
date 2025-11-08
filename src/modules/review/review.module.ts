import { Module } from "@nestjs/common"
import { ReviewService } from "@/modules/review/review.service"
import { ReviewRepository } from "@/modules/review/review.repository"
import { CustomerModule } from "@/modules/customer/customer.module"
import { AccountModule } from "@/modules/account/account.module"
import { ReviewController } from "@/modules/review/review.controller"

@Module({
  imports: [CustomerModule, AccountModule],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
