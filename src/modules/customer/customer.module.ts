import { Module } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CustomerRepository } from "./customer.repository"
import { UtilsModule } from "@/common/utils/utils.module"
import { CustomerController } from "./customer.controller"

@Module({
  imports: [UtilsModule],
  providers: [CustomerService, CustomerRepository],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
