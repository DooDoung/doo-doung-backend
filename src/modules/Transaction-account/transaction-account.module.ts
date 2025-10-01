import { Module } from "@nestjs/common"
import { TransactionAccountController } from "./transaction-account.controller"
import { TransactionAccountRepository } from "./transaction-account.repository"
import { CustomerModule } from "../customer/customer.module"
import { AccountModule } from "../account/account.module"

@Module({
  imports: [CustomerModule, AccountModule],
  controllers: [TransactionAccountController],
  providers: [TransactionAccountRepository],
  exports: [TransactionAccountRepository],
})
export class TransactionModule {}
