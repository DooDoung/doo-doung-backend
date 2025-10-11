import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"
import { Role, ZodiacSign } from "@prisma/client"

export class BaseRegisterDto {
  @ApiProperty({ example: "john_doe" })
  @IsString()
  @MaxLength(30)
  username!: string

  @ApiProperty({ example: "john.doe@example.com" })
  @IsEmail()
  email!: string

  @ApiProperty({ example: "securepassword123" })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string

  @ApiProperty({ enum: Role, example: Role.CUSTOMER })
  @IsEnum(Role)
  role!: Role

  @ApiProperty({ example: "John" })
  @IsString()
  name!: string

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastname!: string

  @ApiProperty({ example: "https://example.com/profile.jpg" })
  @IsString()
  profileUrl!: string

  @ApiPropertyOptional({ example: "1234567890" })
  @IsOptional()
  @IsString()
  phoneNumber?: string

  @ApiPropertyOptional({ example: "MALE" })
  @IsOptional()
  @IsString()
  gender?: string
}

export class CustomerRegisterDto extends BaseRegisterDto {
  @ApiProperty({ example: "ARIES" })
  @IsString()
  zodiacSign!: ZodiacSign

  @ApiPropertyOptional({ type: String, format: "date", example: "1990-01-01" })
  @IsOptional()
  birthDate?: Date

  @ApiPropertyOptional({ type: String, format: "time", example: "12:00:00" })
  @IsOptional()
  birthTime?: Date
}

export class ProphetTxAccountDto {
  @ApiProperty({ example: "Bank of America" })
  @IsString()
  bank!: string

  @ApiProperty({ example: "John Doe" })
  @IsString()
  accountName!: string

  @ApiProperty({ example: "123456789" })
  @IsString()
  accountNumber!: string
}

export class ProphetRegisterDto extends BaseRegisterDto {
  @ApiPropertyOptional({ example: "line12345" })
  @IsOptional()
  @IsString()
  lineId?: string

  @ApiPropertyOptional({
    type: [ProphetTxAccountDto],
    example: [
      {
        bank: "Bank of America",
        accountName: "John Doe",
        accountNumber: "123456789",
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProphetTxAccountDto)
  txAccounts?: ProphetTxAccountDto[]
}
