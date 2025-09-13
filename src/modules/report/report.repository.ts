import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<
    Array<{
      customerId: string
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
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
      },
    })
  }

  findByCustomerId(customerId: string): Promise<
    Array<{
      customerId: string
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
      },
    })
  }
}
