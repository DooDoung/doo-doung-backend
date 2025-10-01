import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length, IsEnum } from "class-validator"

export class TransactionAccountDto {
  @ApiProperty()
  @Length(16, 16, { message: "accountID length should be 16" })
  id!: string

  @ApiProperty()
  @Length(16, 16, { message: "prophetId length should be 16" })
  prophetId!: string

  @ApiProperty()
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName!: string

  @ApiProperty()
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber!: string

  @ApiProperty({ enum: Bank })
  @IsEnum(Bank)
  bank!: Bank

  @ApiProperty()
  isDefault!: boolean
}

export class CreateTransactionAccountDto {
  @ApiProperty({ example: "dev_prophet_001" })
  @Length(16, 16, { message: "prophetId length should be 16" })
  prophetId!: string

  @ApiProperty({ example: "Main Business Account" })
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName!: string

  @ApiProperty({ example: "1234567890" })
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber!: string

  @ApiProperty({ enum: Bank, example: "KBANK" })
  @IsEnum(Bank)
  bank!: Bank
}

export class UpdateTransactionAccountDto {
  @ApiPropertyOptional()
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName?: string

  @ApiPropertyOptional()
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber?: string

  @ApiPropertyOptional({ enum: Bank })
  @IsEnum(Bank)
  bank?: Bank
}

export class TransactionAccountOptionalDto {
  @ApiProperty()
  @Length(16, 16, { message: "id length should be 16" })
  id!: string

  @ApiProperty()
  @Length(16, 16, { message: "prophetId length should be 16" })
  prophetId!: string

  @ApiPropertyOptional()
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName?: string

  @ApiPropertyOptional()
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber?: string

  @ApiPropertyOptional({ enum: Bank })
  @IsEnum(Bank)
  bank?: Bank
}

export class TransactionsAccountResponseDto {
  @ApiProperty({ type: [TransactionAccountDto] })
  transactions!: TransactionAccountDto[]
}

export class TransactionsAccountPostDto {
  @ApiProperty({ type: [TransactionAccountDto] })
  transactions!: TransactionAccountDto[]
}

export class TransactionAccountPatchDto {
  @ApiProperty({ type: [TransactionAccountOptionalDto] })
  transactions!: TransactionAccountOptionalDto[]
}
