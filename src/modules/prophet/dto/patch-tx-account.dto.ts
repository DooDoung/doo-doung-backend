import { ApiPropertyOptional } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length, IsEnum } from "class-validator"

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
