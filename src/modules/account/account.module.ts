import { Module } from "@nestjs/common"
import { AccountController } from "./account.controller"
import { AccountService } from "./account.service"
import { AccountRepository } from "./account.repository"
import { CustomerModule } from "../customer/customer.module"
import { ProphetModule } from "../prophet/prophet.module"
import { NanoidGenerator } from "@/common/utils/nanoid"
import { UtilsModule } from "@/common/utils/utils.module"

@Module({
  imports: [CustomerModule, ProphetModule, UtilsModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, NanoidGenerator],
  exports: [AccountService],
})
export class AccountModule {}
