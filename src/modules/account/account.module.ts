import { Module } from "@nestjs/common"
import { AccountController } from "./account.controller"
import { AccountService } from "./account.service"
import { AccountRepository } from "./account.repository"
import { CustomerModule } from "../customer/customer.module"
import { ProphetModule } from "../prophet/prophet.module"
import { NanoidGenerator } from "@/common/utils/nanoid"
import { HashUtils } from "@/common/utils/hash.util"

@Module({
  imports: [CustomerModule, ProphetModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, NanoidGenerator, HashUtils],
  exports: [AccountService],
})
export class AccountModule {}
