import { Module } from "@nestjs/common"
import { TransactionAccountController } from "./transaction-account.controller"
import { TransactionAccountService } from "./transaction-account.service"
import { TransactionAccountRepository } from "./transaction-account.repository"
import { ProphetModule } from "../prophet/prophet.module"
import { UtilsModule } from "../../common/utils/utils.module"
import { PrismaModule } from "../../db/prisma.module"

@Module({
  imports: [ProphetModule, UtilsModule, PrismaModule],
  controllers: [TransactionAccountController],
  providers: [TransactionAccountService, TransactionAccountRepository],
  exports: [TransactionAccountService, TransactionAccountRepository],
})
export class TransactionAccountModule {}
