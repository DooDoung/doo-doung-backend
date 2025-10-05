import { Module } from "@nestjs/common"
import { TransactionAccountController } from "./tx-account.controller"
import { TransactionAccountService } from "./tx-account.service"
import { TransactionAccountRepository } from "./tx-account.repository"
import { ProphetModule } from "./prophet.module"
import { UtilsModule } from "../../common/utils/utils.module"
import { PrismaModule } from "../../db/prisma.module"

@Module({
  imports: [ProphetModule, UtilsModule, PrismaModule],
  controllers: [TransactionAccountController],
  providers: [TransactionAccountService, TransactionAccountRepository],
  exports: [TransactionAccountService, TransactionAccountRepository],
})
export class TransactionAccountModule {}
