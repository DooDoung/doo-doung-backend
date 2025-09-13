import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class ReportDto {
  @ApiProperty()
  customer!: string

  @ApiPropertyOptional()
  admin?: string | null

  @ApiProperty()
  reportType!: string

  @ApiProperty()
  topic!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  reportStatus!: string
}

export class GetReportsResponseDto {
  @ApiProperty({ type: [ReportDto] })
  reports!: ReportDto[]
}
