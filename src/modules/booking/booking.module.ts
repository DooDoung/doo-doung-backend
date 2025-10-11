import { Module } from "@nestjs/common"
import { BookingController } from "./booking.controller"
import { BookingService } from "./booking.service"
import { BookingRepository } from "./booking.repository"
import { UtilsModule } from "@/common/utils/utils.module"
import { PaymentModule } from "../payment/payment.module"
import { ProphetModule } from "../prophet/prophet.module"
import { CustomerModule } from "../customer/customer.module"
import { CourseModule } from "../course/course.module"
@Module({
  imports: [PaymentModule, UtilsModule, ProphetModule, CustomerModule, CourseModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
