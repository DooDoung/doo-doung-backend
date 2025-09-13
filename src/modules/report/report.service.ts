import { Injectable, NotFoundException } from "@nestjs/common"
import { ReportRepository } from "./report.repository"
import { CustomerService } from "../customer/customer.service"
import { GetReportsResponseDto } from "./dto/get-report.dto"

@Injectable()
export class ReportService {
  constructor(
    private readonly repo: ReportRepository,
    private readonly customerService: CustomerService
  ) {}

  async getAllReports(): Promise<GetReportsResponseDto> {
    const reportData = await this.repo.findAll()
    const reports = reportData.map(r => ({
      customer: r.customerId,
      admin: r.adminId,
      reportType: r.reportType,
      topic: r.topic,
      description: r.description,
      reportStatus: r.reportStatus,
    }))
    return { reports }
  }

  async getReportByCustomerId(
    customerId: string
  ): Promise<GetReportsResponseDto> {
    const customer =
      await this.customerService.getCustomerByCustomerId(customerId)
    if (!customer?.id) {
      throw new NotFoundException("Customer not found" + customerId)
    }

    //Todo: add validate own account
    if (customer.isPublic) {
      const reportData = await this.repo.findByCustomerId(customer.id)
      const reports = reportData.map(r => ({
        customer: r.customerId,
        admin: r.adminId,
        reportType: r.reportType,
        topic: r.topic,
        description: r.description,
        reportStatus: r.reportStatus,
      }))
      return { reports }
    } else {
      return { reports: [] }
    }
  }
}
