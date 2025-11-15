import { Module } from "@nestjs/common"
import { ReviewService } from "@/modules/review/review.service"
import { ReviewRepository } from "@/modules/review/review.repository"
import { CustomerModule } from "@/modules/customer/customer.module"
import { AccountModule } from "@/modules/account/account.module"
import { ReviewController } from "@/modules/review/review.controller"
import { NanoidService } from "@/common/utils/nanoid"

@Module({
  imports: [CustomerModule, AccountModule],
  providers: [ReviewService, ReviewRepository, NanoidService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
