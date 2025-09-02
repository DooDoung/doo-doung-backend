import { Module } from "@nestjs/common"
import { AccountController } from "./account.controller"
import { AccountService } from "./account.service"
import { AccountRepository } from "./account.repository"
import { CustomerModule } from "../customer/customer.module"
import { ProphetModule } from "../prophet/prophet.module"

@Module({
  imports: [CustomerModule, ProphetModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
