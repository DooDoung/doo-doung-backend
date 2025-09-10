import { Module } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CustomerRepository } from "./customer.repository"
import { NanoidGenerator } from "@/common/utils/nanoid"

@Module({
  providers: [CustomerService, CustomerRepository, NanoidGenerator],
  exports: [CustomerService],
})
export class CustomerModule {}
