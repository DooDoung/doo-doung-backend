import { Module } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CustomerRepository } from "./customer.repository"

@Module({
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService],
})
export class CustomerModule {}
