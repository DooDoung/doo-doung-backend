import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ReportStatus } from "@prisma/client"

export class ReportDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  customerId!: string

  @ApiPropertyOptional({ nullable: true })
  profileUrl?: string | null

  @ApiPropertyOptional({ nullable: true })
  adminId?: string | null

  @ApiProperty()
  reportType!: string

  @ApiProperty()
  topic!: string

  @ApiProperty()
  description!: string

  @ApiProperty({ enum: ReportStatus })
  reportStatus!: ReportStatus

  @ApiProperty({ type: Date })
  createdAt!: Date

  @ApiProperty({ type: Date })
  updatedAt!: Date
}

export class ProphetReportDto extends ReportDto {
  @ApiPropertyOptional({ nullable: true })
  prophetId?: string | null

  @ApiProperty()
  courseId!: string | null
}

export class GetReportsResponseDto {
  @ApiProperty({ type: [ReportDto] })
  reports!: ReportDto[]
}

export class PaginatedReportsResponseDto extends GetReportsResponseDto {
  @ApiProperty()
  total!: number

  @ApiProperty()
  page!: number

  @ApiProperty()
  limit!: number
}
