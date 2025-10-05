import { ApiProperty } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length, IsEnum, IsString, IsNotEmpty } from "class-validator"

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
