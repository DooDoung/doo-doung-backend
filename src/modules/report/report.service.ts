import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { ReportRepository } from "./report.repository"
import { CustomerService } from "../customer/customer.service"
import { AccountService } from "../account/account.service"
import { ReportDto, GetReportsResponseDto } from "./dto/get-report.dto"
import { GetAdminReportsResponseDto } from "./dto/admin-report.dto"
import { Role, ReportStatus, ReportType } from "@prisma/client"
import { ProphetService } from "../prophet/prophet.service"
import {
  CreateReportDto,
  CreateReportResponseDto,
} from "./dto/create-report.dto"

@Injectable()
export class ReportService {
  constructor(
    private readonly repo: ReportRepository,
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
    private readonly prophetService: ProphetService
  ) {}

  async getAllReports(): Promise<GetReportsResponseDto> {
    const reportData = await this.repo.findAll()
    const reports = await Promise.all(
      reportData.map(async r => {
        const customer = await this.customerService.getAccountByCustomerId(
          r.customerId
        )
        if (!customer?.id) throw new NotFoundException("Customer not found")

        const accountId = customer.accountId
        if (!accountId) throw new NotFoundException("Account not found")

        const accountData = await this.accountService.getAccountById(accountId)

        return {
          id: r.id,
          customerId: accountData.username,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          profileUrl: accountData.profileUrl,
          adminId: r.adminId,
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
    const r = await this.repo.findById(reportId)
    if (!r) throw new NotFoundException("Report not found")

    const customer = await this.customerService.getAccountByCustomerId(
      r.customerId
    )
    if (!customer?.id) throw new NotFoundException("Customer not found")

    const accountId = customer.accountId
    if (!accountId) throw new NotFoundException("Account not found")

    const accountData = await this.accountService.getAccountById(accountId)

    return {
      id: r.id,
      customerId: accountData.username,
      adminId: r.adminId,
      reportType: r.reportType,
      topic: r.topic,
      description: r.description,
      reportStatus: r.reportStatus,
      profileUrl: accountData.profileUrl,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }
  }

  async getReportByAccountId(
    accountId: string
  ): Promise<GetReportsResponseDto> {
    const accountData = await this.accountService.getAccountById(accountId)
    if (!accountData) throw new NotFoundException("Account not found")

    const role = accountData.role
    if (!role) throw new NotFoundException("Role not found")

    if (role === Role.CUSTOMER) {
      const customer =
        await this.customerService.getCustomerByAccountId(accountId)
      if (!customer?.id) throw new NotFoundException("Customer not found")

      const reportData = await this.repo.findByCustomerId(customer.id)
      const reports = reportData.map(r => ({
        id: r.id,
        customerId: accountData.username,
        adminId: r.adminId,
        reportType: r.reportType,
        topic: r.topic,
        description: r.description,
        reportStatus: r.reportStatus,
        profileUrl: accountData.profileUrl ?? null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
      return { reports }
    } else if (role === Role.ADMIN) {
      const reportData = await this.repo.findByAdminId(accountId)
      const reports = await Promise.all(
        reportData.map(async r => {
          const customer = await this.customerService.getAccountByCustomerId(
            r.customerId
          )
          if (!customer?.accountId)
            throw new NotFoundException("Customer not found")

          const custAccount = await this.accountService.getAccountById(
            customer.accountId
          )
          return {
            id: r.id,
            customerId: custAccount?.username ?? "Unknown",
            adminId: accountData.username,
            reportType: r.reportType,
            topic: r.topic,
            description: r.description,
            reportStatus: r.reportStatus,
            profileUrl: custAccount?.profileUrl ?? null,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          }
        })
      )
      return { reports }
    } else if (role === Role.PROPHET) {
      const prophet = await this.prophetService.getProphetByAccountId(accountId)
      if (!prophet?.id) throw new NotFoundException("Prophet not found")

      const reportData = await this.repo.findByProphetId(prophet.id)
      const reports = await Promise.all(
        reportData.map(async r => {
          const customer = await this.customerService.getAccountByCustomerId(
            r.customerId
          )
          if (!customer?.accountId)
            throw new NotFoundException("Customer not found")

          const custAccount = await this.accountService.getAccountById(
            customer.accountId
          )
          return {
            id: r.id,
            customerId: custAccount?.username ?? "Unknown",
            prophetId: prophet.id,
            reportType: r.reportType,
            topic: r.topic,
            description: r.description,
            reportStatus: r.reportStatus,
            profileUrl: custAccount?.profileUrl ?? null,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          }
        })
      )
      return { reports }
    }

    throw new NotFoundException("neither Customer nor Admin")
  }

  async getAdminReports(
    statuses: ("ALL" | "PENDING" | "DONE" | "DISCARD")[],
    page = 1,
    limit = 15
  ): Promise<GetAdminReportsResponseDto> {
    let statusFilters: ReportStatus[]

    if (statuses.includes("ALL")) {
      statusFilters = [
        ReportStatus.PENDING,
        ReportStatus.DONE,
        ReportStatus.DISCARD,
      ]
    } else {
      statusFilters = statuses.map(s => s as ReportStatus).filter(Boolean)
      if (statusFilters.length === 0) statusFilters = [ReportStatus.PENDING]
    }

    const { reports, total } = await this.repo.getAdminReports(
      statusFilters,
      page,
      limit
    )

    const cleanReports = await Promise.all(
      reports.map(async r => {
        const customer = await this.customerService.getAccountByCustomerId(
          r.customerId
        )
        if (!customer?.accountId)
          throw new NotFoundException("Customer not found")
        const custAccount = await this.accountService.getAccountById(
          customer.accountId
        )

        return {
          id: r.id,
          customerId: custAccount?.username ?? "Unknown",
          reportType: r.reportType as ReportType,
          topic: r.topic,
          description: r.description,
          reportStatus: r.reportStatus,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          adminId: r.adminId,
        }
      })
    )

    const totalPages = Math.ceil(total / limit)
    return { reports: cleanReports, total, page, totalPages }
  }

  async createReport(body: CreateReportDto): Promise<CreateReportResponseDto> {
    const customer = await this.customerService.getCustomerByAccountId(
      body.accountId
    )
    if (!customer?.id) throw new NotFoundException("Customer not found")
    const newReport = await this.repo.createReport(customer.id, body)
    return newReport
  }

  async updateReportStatus(
    reportId: string,
    status: "DONE" | "DISCARD",
    adminId: string
  ): Promise<{ id: string; reportStatus: string; updatedAt: Date }> {
    const existing = await this.repo.findReportById(reportId)
    if (!existing) throw new NotFoundException("Report not found")

    if (existing.reportStatus !== ReportStatus.PENDING) {
      throw new BadRequestException(
        `Only PENDING reports can be updated. Current status: ${existing.reportStatus}`
      )
    }

    const updated = await this.repo.updateReportStatus(
      reportId,
      status,
      adminId
    )
    if (!updated) throw new NotFoundException("Report not found")

    return {
      id: updated.id,
      reportStatus: updated.reportStatus,
      updatedAt: updated.updatedAt,
    }
  }
}
