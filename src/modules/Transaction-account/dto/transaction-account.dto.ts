import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length } from "class-validator"

export class prophetAccountDto {
  @ApiProperty()
  @Length(16, 16, { message: "prophetId length should be 16" })
  prophetId!: string
}

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

  @ApiProperty()
  bank!: Bank
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

  @ApiPropertyOptional()
  bank?: Bank
}

export class TransactionsAccountResponseDto {
  @ApiProperty({ type: [prophetAccountDto] })
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
