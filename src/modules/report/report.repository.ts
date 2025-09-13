import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"

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
}
