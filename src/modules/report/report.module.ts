import { Module } from "@nestjs/common"
import { ReportController } from "./report.controller"
import { ReportService } from "./report.service"
import { ReportRepository } from "./report.repository"
import { CustomerModule } from "../customer/customer.module"
import { AccountModule } from "../account/account.module"

@Module({
  imports: [CustomerModule, AccountModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  exports: [ReportService],
})
export class ReportModule {}
