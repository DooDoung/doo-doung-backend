import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { ReportStatus } from "@prisma/client"

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<
    Array<{
      customerId: string
      customer: { accountId: string }
      createdAt: Date | null
      adminId: string | null
      reportType: string
      topic: string
      description: string
      reportStatus: string
    }>
  > {
    return this.prisma.report.findMany({
      select: {
        customerId: true,
        customer: {
          select: {
            accountId: true,
          },
        },
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
      },
    })
  }

  findById(reportId: string): Promise<{
    customerId: string
    createdAt: Date | null
    adminId: string | null
    reportType: string
    topic: string
    description: string
    reportStatus: string
  } | null> {
    return this.prisma.report.findUnique({
      where: {
        id: reportId,
      },
      select: {
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
      },
    })
  }

  findByCustomerId(customerId: string): Promise<
    Array<{
      customerId: string
      createdAt: Date | null
      adminId: string | null
      reportType: string
      topic: string
      description: string
      reportStatus: string
    }>
  > {
    return this.prisma.report.findMany({
      where: {
        customerId: customerId,
      },
      select: {
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
      },
    })
  }

  findByAdminId(adminId: string): Promise<
    Array<{
      customerId: string
      createdAt: Date | null
      adminId: string | null
      reportType: string
      topic: string
      description: string
      reportStatus: string
    }>
  > {
    return this.prisma.report.findMany({
      where: {
        adminId: adminId,
      },
      select: {
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
      },
    })
  }

  async getAdminReports(
    statuses: ReportStatus[],
    page: number = 1,
    limit: number = 15
  ): Promise<{
    reports: Array<{
      id: string
      customerId: string
      reportType: string
      topic: string
      description: string
      reportStatus: ReportStatus
      createdAt: Date
      updatedAt: Date
      adminId: string | null
    }>
    total: number
  }> {
    const skip = (page - 1) * limit

    const reports = await this.prisma.report.findMany({
      where: {
        reportStatus: {
          in: statuses,
        },
      },
      select: {
        id: true,
        customerId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        adminId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const total = await this.prisma.report.count({
      where: {
        reportStatus: {
          in: statuses,
        },
      },
    })

    return { reports, total }
  }

  async updateReportStatus(
    reportId: string,
    status: "DONE" | "DISCARD",
    adminId: string
  ): Promise<{
    id: string
    reportStatus: ReportStatus
    updatedAt: Date
  } | null> {
    return this.prisma.report.update({
      where: { id: reportId },
      data: {
        reportStatus: status as ReportStatus,
        adminId: adminId,
      },
      select: {
        id: true,
        reportStatus: true,
        updatedAt: true,
      },
    })
  }

  async findReportById(reportId: string): Promise<{
    id: string
    reportStatus: ReportStatus
  } | null> {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        reportStatus: true,
      },
    })
  }
}
