import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ReportStatus, ReportType } from "@prisma/client"
import { IsEnum, IsOptional, IsString } from "class-validator"

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  accountId!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prophetId?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseId?: string | null

  @ApiProperty({ example: "COURSE_ISSUE" })
  @IsEnum(ReportType)
  reportType!: ReportType

  @ApiProperty({ example: "Course is not working" })
  @IsString()
  topic!: string

  @ApiProperty({ example: "The video in lesson 3 fails to load." })
  @IsString()
  description!: string
}

export class CreateReportResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  customerId!: string

  @ApiProperty({ example: "COURSE_ISSUE" })
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
