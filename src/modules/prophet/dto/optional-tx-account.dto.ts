import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Bank } from "@prisma/client"
import { Length, IsEnum } from "class-validator"

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
