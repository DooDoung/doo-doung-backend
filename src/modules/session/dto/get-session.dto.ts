import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class SessionDto {
  @ApiProperty({ example: "bk_1234567890abcd" })
  id!: string

  @ApiProperty({ example: "cus_1234567890abcd" })
  customerId!: string

  @ApiProperty({ example: "crs_1234567890abcd" })
  courseId!: string

  @ApiProperty({ example: "pro_1234567890abcd" })
  prophetId!: string

  @ApiProperty({ example: "scheduled" })
  status!: string

  @ApiProperty({ example: "2025-10-21T10:00:00.000Z" })
  startDateTime!: Date

  @ApiProperty({ example: "2025-10-21T10:30:00.000Z" })
  endDateTime!: Date

  @ApiPropertyOptional({ example: "Napat S." })
  customerName?: string | null

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  customerProfileUrl?: string | null

  @ApiPropertyOptional({ example: "Tarot Reading" })
  courseName?: string | null

  @ApiPropertyOptional({ example: "Tarot" })
  horoscopeMethodName?: string | null

  @ApiPropertyOptional({ example: 500.0 })
  amount?: number | null

  @ApiPropertyOptional({ example: 5 })
  reviewScore?: number | null

  @ApiPropertyOptional({ example: "Very insightful session!" })
  reviewDescription?: string | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class GetSessionsResponseDto {
  @ApiProperty({ type: [SessionDto] })
  sessions!: SessionDto[]
}
