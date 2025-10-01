import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length, IsEnum, IsString, IsNotEmpty } from "class-validator"

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

export class CreateTransactionAccountDto {
  @ApiProperty({
    description: "ID of the prophet who will own this account",
    example: "dev_prophet_001",
    minLength: 10,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 50, {
    message: "prophetId length should be between 10 and 50 characters",
  })
  prophetId!: string

  @ApiProperty({
    description: "Display name for the new transaction account",
    example: "Main Business Account",
    minLength: 1,
    maxLength: 45,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName!: string

  @ApiProperty({
    description: "Bank account number (must be unique per bank)",
    example: "1234567890",
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber!: string

  @ApiProperty({
    enum: Bank,
    description:
      "Thai bank identifier. Supported banks: BBL, KTB, KBANK, SCB, BAY, TTB, CIMB, UOB, GSB, BAAC",
    example: "KBANK",
    enumName: "Bank",
  })
  @IsEnum(Bank)
  bank!: Bank
}

export class UpdateTransactionAccountDto {
  @ApiPropertyOptional({
    description: "Updated display name for the transaction account",
    example: "Updated Business Account",
    minLength: 1,
    maxLength: 45,
  })
  @Length(1, 45, { message: "accountName length should be max 45 characters" })
  accountName?: string

  @ApiPropertyOptional({
    description: "Updated bank account number",
    example: "9876543210",
    minLength: 1,
    maxLength: 20,
  })
  @Length(1, 20, {
    message: "accountNumber length should be max 20 characters",
  })
  accountNumber?: string

  @ApiPropertyOptional({
    enum: Bank,
    description: "Updated bank identifier",
    example: "SCB",
    enumName: "Bank",
  })
  @IsEnum(Bank)
  bank?: Bank
}

export class TransactionAccountOptionalDto {
  @ApiProperty()
  @Length(16, 16, { message: "id length should be 16" })
  id!: string

  @ApiPropertyOptional()
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
