import { Module } from "@nestjs/common"
import { ReportController } from "./report.controller"
import { ReportService } from "./report.service"
import { ReportRepository } from "./report.repository"
import { CustomerModule } from "../customer/customer.module"
import { AccountModule } from "../account/account.module"
import { ProphetModule } from "../prophet/prophet.module"
import { NanoidService } from "@/common/utils/nanoid"

@Module({
  imports: [CustomerModule, AccountModule, ProphetModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository, NanoidService],
  exports: [ReportService],
})
export class ReportModule {}
