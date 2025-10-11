import { Module } from "@nestjs/common"
import { UtilsModule } from "@/common/utils/utils.module"
import { PaymentService } from "./payment.service"
import { PaymentRepository } from "./payment.repository"

@Module({
  providers: [PaymentService, PaymentRepository, UtilsModule],
  exports: [PaymentService],
})
export class PaymentModule {}
