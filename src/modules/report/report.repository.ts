import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { ReportStatus } from "@prisma/client"
import {
  ReportDto,
  ProphetReportDto,
  PaginatedReportsResponseDto,
} from "./dto/get-report.dto"

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ReportDto[]> {
    return this.prisma.report.findMany({
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
    }) as unknown as Promise<ReportDto[]>
  }

  findById(reportId: string): Promise<ReportDto> {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
    }) as unknown as Promise<ReportDto>
  }

  findByCustomerId(customerId: string): Promise<ReportDto[]> {
    return this.prisma.report.findMany({
      where: { customerId },
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
    }) as unknown as Promise<ReportDto[]>
  }

  findByAdminId(adminId: string): Promise<ReportDto[]> {
    return this.prisma.report.findMany({
      where: { adminId },
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
    }) as unknown as Promise<ReportDto[]>
  }

  findByProphetId(prophetId: string): Promise<ProphetReportDto[]> {
    return this.prisma.report.findMany({
      where: { prophetId },
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
    }) as unknown as Promise<ProphetReportDto[]>
  }

  async findByCourseId(courseId: string): Promise<ReportDto[]> {
    return this.prisma.report.findMany({
      where: { courseId },
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
    }) as unknown as Promise<ReportDto[]>
  }

  async getAdminReports(
    statuses: ReportStatus[],
    page: number = 1,
    limit: number = 15
  ): Promise<PaginatedReportsResponseDto> {
    const skip = (page - 1) * limit

    const reports = await this.prisma.report.findMany({
      where: { reportStatus: { in: statuses } },
      select: {
        id: true,
        customerId: true,
        adminId: true,
        reportType: true,
        topic: true,
        description: true,
        reportStatus: true,
        createdAt: true,
        updatedAt: true,
        prophetId: true,
        courseId: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    const total = await this.prisma.report.count({
      where: { reportStatus: { in: statuses } },
    })

    return { reports, total } as unknown as PaginatedReportsResponseDto
  }

  updateReportStatus(
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
      data: { reportStatus: status as ReportStatus, adminId },
      select: { id: true, reportStatus: true, updatedAt: true },
    })
  }

  findReportById(
    reportId: string
  ): Promise<{ id: string; reportStatus: ReportStatus } | null> {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      select: { id: true, reportStatus: true },
    })
  }
}
