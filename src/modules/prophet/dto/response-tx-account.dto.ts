import { ApiProperty } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length, IsEnum } from "class-validator"

export class TransactionAccountDto {
  @ApiProperty({
    description: "Unique identifier for the transaction account",
    example: "tx_acc_001234567",
    minLength: 10,
    maxLength: 50,
  })
  id!: string

  @ApiProperty({
    description: "ID of the prophet who owns this account",
    example: "dev_prophet_001",
    minLength: 16,
    maxLength: 16,
  })
  @Length(16, 16, { message: "prophetId length should be 16" })
  prophetId!: string

  @ApiProperty({
    description: "Display name for the transaction account",
    example: "Main Business Account",
    minLength: 1,
    maxLength: 45,
  })
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName!: string

  @ApiProperty({
    description: "Bank account number",
    example: "1234567890",
    minLength: 1,
    maxLength: 20,
  })
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber!: string

  @ApiProperty({
    enum: Bank,
    description: "Thai bank identifier",
    example: "KBANK",
    enumName: "Bank",
  })
  @IsEnum(Bank)
  bank!: Bank

  @ApiProperty({
    description:
      "Whether this is the default transaction account for the prophet",
    example: true,
  })
  isDefault!: boolean
}

export class TransactionsAccountResponseDto {
  @ApiProperty({ type: [TransactionAccountDto] })
  transactions!: TransactionAccountDto[]
}
