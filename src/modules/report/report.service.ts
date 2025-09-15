import { Injectable, NotFoundException } from "@nestjs/common"
import { ReportRepository } from "./report.repository"
import { CustomerService } from "../customer/customer.service"
import { AccountService } from "../account/account.service"
import { ReportDto, GetReportsResponseDto } from "./dto/get-report.dto"
import { Role } from "@prisma/client"

@Injectable()
export class ReportService {
  constructor(
    private readonly repo: ReportRepository,
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService
  ) {}

  async getAllReports(): Promise<GetReportsResponseDto> {
    const reportData = await this.repo.findAll()
    const reports = await Promise.all(
      reportData.map(async r => {
        const customer = await this.customerService.getAccountByCustomerId(
          r.customerId
        )
        if (!customer?.id) {
          throw new NotFoundException("Customer not found")
        }
        const accountId = customer.accountId
        if (!accountId) {
          throw new NotFoundException("Account not found")
        }
        const accountData = await this.accountService.getAccountById(accountId)

        return {
          customer: accountData.username,
          createdAt: r.createdAt,
          profileUrl: accountData.profileUrl,
          admin: r.adminId,
          reportType: r.reportType,
          topic: r.topic,
          description: r.description,
          reportStatus: r.reportStatus,
        }
      })
    )

    return { reports }
  }

  async getReportById(reportId: string): Promise<ReportDto> {
    const reportData = await this.repo.findById(reportId)
    if (!reportData) {
      throw new NotFoundException("Report not found")
    }
    const customer = await this.customerService.getAccountByCustomerId(
      reportData.customerId
    )
    if (!customer?.id) {
      throw new NotFoundException("Customer not found")
    }
    const accountId = customer.accountId
    if (!accountId) {
      throw new NotFoundException("Account not found")
    }

    const accountData = await this.accountService.getAccountById(accountId)

    const report = {
      customer: accountData.username,
      admin: reportData.adminId,
      reportType: reportData.reportType,
      topic: reportData.topic,
      description: reportData.description,
      reportStatus: reportData.reportStatus,
      profileUrl: accountData.profileUrl,
      createdAt: reportData.createdAt,
    }
    return report
  }

  async getReportByAccountId(
    accountId: string
  ): Promise<GetReportsResponseDto> {
    const accountData = await this.accountService.getAccountById(accountId)
    if (!accountData) {
      throw new NotFoundException("Account not found")
    }
    const role = accountData.role
    if (!role) {
      throw new NotFoundException("Role not found")
    }

    if (role === Role.CUSTOMER) {
      const customer =
        await this.customerService.getCustomerByAccountId(accountId)
      if (!customer?.id) {
        throw new NotFoundException("Customer not found")
      }
      const reportData = await this.repo.findByCustomerId(customer.id)
      const reports = reportData.map(r => ({
        customer: accountData.username,
        admin: r.adminId,
        reportType: r.reportType,
        topic: r.topic,
        description: r.description,
        reportStatus: r.reportStatus,
        profileUrl: accountData.profileUrl ?? null,
        createdAt: r.createdAt,
      }))
      return { reports }
    } else if (role === Role.ADMIN) {
      const reportData = await this.repo.findByAdminId(accountId)

      const reports = await Promise.all(
        reportData.map(async r => {
          const customer = await this.customerService.getAccountByCustomerId(
            r.customerId
          )
          if (!customer?.accountId) {
            throw new NotFoundException("Customer not found")
          }
          const custAccount = await this.accountService.getAccountById(
            customer.accountId
          )

          return {
            customer: custAccount?.username ?? "Unknown",
            admin: accountData.username,
            reportType: r.reportType,
            topic: r.topic,
            description: r.description,
            reportStatus: r.reportStatus,
            profileUrl: custAccount?.profileUrl ?? null,
            createdAt: r.createdAt,
          }
        })
      )

      return { reports }
    }
    throw new NotFoundException("neither Customer nor Admin")
  }

  async getReportByCustomerId(
    customerId: string
  ): Promise<GetReportsResponseDto> {
    const customer =
      await this.customerService.getAccountByCustomerId(customerId)
    if (!customer?.id) {
      throw new NotFoundException("Customer not found")
    }
    const accountId = customer.accountId
    if (!accountId) {
      throw new NotFoundException("Account not found")
    }
    const accountData = await this.accountService.getAccountById(accountId)
    const reportData = await this.repo.findByCustomerId(customerId)

    const reports = reportData.map(r => ({
      customer: accountData.username,
      admin: r.adminId,
      reportType: r.reportType,
      topic: r.topic,
      description: r.description,
      reportStatus: r.reportStatus,
      profileUrl: accountData.profileUrl,
      createdAt: r.createdAt,
    }))
    return { reports }
  }
}
