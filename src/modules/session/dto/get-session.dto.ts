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

  @ApiPropertyOptional({ example: "proph_username" })
  prophetUsername?: string | null

  @ApiPropertyOptional({ example: "https://example.com/prophet-avatar.jpg" })
  prophetProfileUrl?: string | null
}

export class GetSessionsResponseDto {
  @ApiProperty({ type: [SessionDto] })
  sessions!: SessionDto[]
}

export class SessionDetailDto {
  sessionId!: string
  courseName!: string
  horoscopeMethod!: string
  horoscopeSector!: string
  startDateTime!: Date
  endDateTime!: Date
  prophetName!: string
  prophetUsername!: string
  prophetProfileUrl!: string | null
  transactionId!: string
  amount!: number
  payoutStatus!: string
  transactionCreatedAt!: Date
  customerName!: string
  customerUsername!: string
  txAccountName!: string | null
  txBank!: string | null
  txAccountNumber!: string | null
}
