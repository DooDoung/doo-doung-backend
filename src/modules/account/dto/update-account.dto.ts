import { ApiProperty } from "@nestjs/swagger"
import { Role, Sex, ZodiacSign } from "@prisma/client"
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"

export class BaseUpdateAccountRequestDto {
  @ApiProperty({ enum: Role, example: Role.CUSTOMER })
  @IsEnum(Role)
  role!: Role

  @ApiProperty({ required: false, example: "new_john_doe" })
  @IsOptional()
  @IsString()
  username?: string

  @ApiProperty({ required: false, example: "new_john.doe@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ required: false, example: "newpassword123" })
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty({ required: false, example: "John2" })
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiProperty({ required: false, example: "Doe2" })
  @IsOptional()
  @IsString()
  lastName?: string

  @ApiProperty({ required: false, example: "1234567890" })
  @IsOptional()
  @IsString()
  phoneNumber?: string

  @ApiProperty({ enum: Sex, required: false, example: Sex.MALE })
  @IsOptional()
  @IsEnum(Sex)
  gender?: Sex

  @ApiProperty({ required: false, example: "https://example.com/profile.jpg" })
  @IsOptional()
  @IsString()
  profileUrl?: string
}

export class CustomerUpdateAccountRequestDto extends BaseUpdateAccountRequestDto {
  @ApiProperty({ enum: Role, default: Role.CUSTOMER, example: Role.CUSTOMER })
  role!: Role

  @ApiProperty({ required: false, example: "ARIES" })
  @IsOptional()
  @IsString()
  zodiacSign?: ZodiacSign

  @ApiProperty({ required: false, format: "date", example: "1990-01-01" })
  @IsOptional()
  birthDate?: Date

  @ApiProperty({ required: false, format: "time", example: "19:00:00" })
  @IsOptional()
  birthTime?: Date
}

export class ProphetUpdateAccountRequestDto extends BaseUpdateAccountRequestDto {
  @ApiProperty({ enum: Role, default: Role.PROPHET, example: Role.PROPHET })
  role!: Role

  @ApiProperty({ required: false, example: "line12345" })
  @IsOptional()
  @IsString()
  lineId?: string
}
