import { Module } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CustomerRepository } from "./customer.repository"
import { UtilsModule } from "@/common/utils/utils.module"

@Module({
  imports: [UtilsModule],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService],
})
export class CustomerModule {}
