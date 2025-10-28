import { ApiProperty } from "@nestjs/swagger"
import { ReportStatus, ReportType } from "@prisma/client"
import { IsEnum, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class GetAdminReportsQueryDto {
  @ApiProperty({
    description: "Report status filter (can be multiple: PENDING,DONE,DISCARD)",
    enum: ReportStatus,
    default: "PENDING",
    required: false,
  })
  @IsEnum(ReportStatus, { each: true })
  @IsOptional()
  @Type(() => String)
  status?: ReportStatus | ReportStatus[] = ReportStatus.PENDING

  @ApiProperty({
    description: "Page number (1-indexed)",
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  page: number = 1

  @ApiProperty({
    description: "Reports per page",
    default: 15,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  limit: number = 15
}

export class AdminReportDto {
  @ApiProperty({ description: "Report unique ID" })
  id!: string

  @ApiProperty({ description: "Customer username who reported" })
  customer!: string

  @ApiProperty({ description: "Report type" })
  reportType!: ReportType

  @ApiProperty({ description: "Report topic" })
  topic!: string

  @ApiProperty({ description: "Report description" })
  description!: string

  @ApiProperty({ description: "Report status", enum: ReportStatus })
  reportStatus!: ReportStatus

  @ApiProperty({ description: "Creation date" })
  createdAt!: Date

  @ApiProperty({ description: "Last update date" })
  updatedAt!: Date

  @ApiProperty({ description: "Admin assigned (if any)", nullable: true })
  adminId?: string | null
}

export class GetAdminReportsResponseDto {
  @ApiProperty({ type: [AdminReportDto] })
  reports!: AdminReportDto[]

  @ApiProperty({ description: "Total number of reports" })
  total!: number

  @ApiProperty({ description: "Current page" })
  page!: number

  @ApiProperty({ description: "Total pages" })
  totalPages!: number
}

export class UpdateReportStatusDto {
  @ApiProperty({
    description: "New report status (only DONE or DISCARD allowed)",
    enum: ["DONE", "DISCARD"],
  })
  @IsEnum(["DONE", "DISCARD"])
  reportStatus!: "DONE" | "DISCARD"
}
