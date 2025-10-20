import { Module } from "@nestjs/common"
import { SessionController } from "./session.controller"
import { SessionService } from "./session.service"
import { SessionRepository } from "./session.repository"
import { CustomerModule } from "../customer/customer.module"
import { AccountModule } from "../account/account.module"
import { ProphetModule } from "../prophet/prophet.module"

@Module({
  imports: [CustomerModule, AccountModule, ProphetModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
