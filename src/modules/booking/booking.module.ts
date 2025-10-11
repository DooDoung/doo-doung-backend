import { Module } from "@nestjs/common"
import { BookingController } from "./booking.controller"
import { BookingService } from "./booking.service"
import { BookingRepository } from "./booking.repository"
import { UtilsModule } from "@/common/utils/utils.module"
import { PaymentModule } from "../payment/payment.module"
import { ProphetModule } from "../prophet/prophet.module"
import { CustomerModule } from "../customer/customer.module"

@Module({
  imports: [PaymentModule, UtilsModule, ProphetModule, CustomerModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
