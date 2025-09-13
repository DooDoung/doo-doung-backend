import { Module } from "@nestjs/common"
import { ReportController } from "./report.controller"
import { ReportService } from "./report.service"
import { ReportRepository } from "./report.repository"
import { CustomerModule } from "../customer/customer.module"

// ? admin

@Module({
  imports: [CustomerModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  exports: [ReportService],
})
export class ReportModule {}
