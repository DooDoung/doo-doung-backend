import { Module } from "@nestjs/common"
import { EXAccountController } from "./account.controller"
import { EXAccountService } from "./account.service"
import { EXAccountRepository } from "./account.repository"

@Module({
  controllers: [EXAccountController],
  providers: [EXAccountService, EXAccountRepository],
  exports: [EXAccountService],
})
export class EXAccountModule {}
