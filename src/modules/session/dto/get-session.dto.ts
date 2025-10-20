import { ApiProperty } from "@nestjs/swagger"

export class SessionDetailDto {
  @ApiProperty({ example: "bk_1234567890abcd" })
  sessionId!: string

  // Course info
  @ApiProperty({ example: "Tarot Reading" })
  courseName!: string

  @ApiProperty({ example: "Tarot" })
  horoscopeMethod!: string

  @ApiProperty({ example: "LOVE" })
  horoscopeSector!: string

  @ApiProperty({ example: "2025-10-21T10:00:00.000Z" })
  startDateTime!: Date

  @ApiProperty({ example: "2025-10-21T10:30:00.000Z" })
  endDateTime!: Date

  // Prophet info
  @ApiProperty({ example: "Napat S." })
  prophetName!: string

  @ApiProperty({ example: "proph_username" })
  prophetUsername!: string

  @ApiProperty({
    example: "https://example.com/prophet-avatar.jpg",
    nullable: true,
  })
  prophetProfileUrl!: string | null

  // Transaction info
  @ApiProperty({ example: "tx_1234567890abcd" })
  transactionId!: string

  @ApiProperty({ example: 500.0 })
  amount!: number

  @ApiProperty({ example: "PENDING_PAYOUT" })
  payoutStatus!: string

  @ApiProperty({ example: "2025-10-21T10:00:00.000Z" })
  transactionCreatedAt!: Date

  // Customer info
  @ApiProperty({ example: "Napat S." })
  customerName!: string

  @ApiProperty({ example: "cus_username" })
  customerUsername!: string

  // Prophet transaction account info
  @ApiProperty({ example: "Napat S. Account", nullable: true })
  txAccountName!: string | null

  @ApiProperty({ example: "BBL", nullable: true })
  txBank!: string | null

  @ApiProperty({ example: "123-456-7890", nullable: true })
  txAccountNumber!: string | null
}

export class GetSessionsResponseDto {
  @ApiProperty({ type: [SessionDetailDto] })
  sessions!: SessionDetailDto[]
}
