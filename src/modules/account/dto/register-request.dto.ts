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
import { Role } from "@prisma/client"

export class BaseRegisterDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  username!: string

  @ApiProperty()
  @IsEmail()
  email!: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string

  @ApiProperty()
  @IsEnum(Role)
  role!: Role

  @ApiProperty()
  @IsString()
  name!: string

  @ApiProperty()
  @IsString()
  lastname!: string

  @ApiProperty()
  @IsString()
  profileUrl!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sex?: string
}

export class CustomerRegisterDto extends BaseRegisterDto {
  @ApiProperty()
  @IsString()
  zodiacSign!: string

  @ApiPropertyOptional({ type: String, format: "date" })
  @IsOptional()
  birthDate?: Date

  @ApiPropertyOptional({ type: String, format: "time" })
  @IsOptional()
  birthTime?: Date
}

export class ProphetTxAccountDto {
  @ApiProperty()
  @IsString()
  bank!: string

  @ApiProperty()
  @IsString()
  accountName!: string

  @ApiProperty()
  @IsString()
  accountNumber!: string
}

export class ProphetRegisterDto extends BaseRegisterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lineId?: string

  @ApiPropertyOptional({ type: [ProphetTxAccountDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProphetTxAccountDto)
  txAccounts?: ProphetTxAccountDto[]
}
