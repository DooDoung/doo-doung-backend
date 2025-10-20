import { ApiProperty } from "@nestjs/swagger"
import { BookingStatus, PayoutStatus } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export class TransactionSnapshotDto {
  @ApiProperty() id!: string
  @ApiProperty() amount!: Decimal
  @ApiProperty({ enum: PayoutStatus }) status!: PayoutStatus
}

export class ProphetSnapshotDto {
  @ApiProperty() balance!: Decimal
}

export class BookingCompleteResponseDto {
  @ApiProperty() id!: string

  @ApiProperty({ enum: BookingStatus })
  status!: BookingStatus

  @ApiProperty() prophetId!: string

  @ApiProperty({ type: TransactionSnapshotDto, nullable: true })
  transaction!: TransactionSnapshotDto | null

  @ApiProperty({ type: ProphetSnapshotDto })
  prophet!: ProphetSnapshotDto
}
