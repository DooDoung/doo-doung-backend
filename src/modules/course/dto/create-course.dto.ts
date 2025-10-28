import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import {
  IsEnum,
  IsString,
  Length,
  Matches,
  IsNumber,
  IsPositive,
} from "class-validator"
import { Type } from "class-transformer"

export class GetCourseResponseDto {
  @ApiProperty()
  @IsString()
  @Length(16)
  id!: string

  @ApiProperty()
  @IsString()
  @Length(16)
  prophetId!: string

  @ApiProperty()
  @IsString()
  @Length(1, 50)
  courseName!: string

  @ApiProperty()
  @IsString()
  courseDescription!: string

  @ApiProperty()
  horoscopeMethodId!: number

  @ApiProperty()
  @IsEnum(HoroscopeSector)
  horoscopeSector!: HoroscopeSector

  @ApiProperty()
  durationMin!: number

  @ApiProperty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: "Price can have up to 2 decimal places only",
  })
  price!: Decimal

  @ApiProperty()
  isActive!: boolean

  @IsString()
  @Length(16)
  name!: string

  @IsString()
  @Length(16)
  lastname!: string

  @IsString()
  @Length(20)
  lineId!: string
}

export class CreateCourseDto {
  @ApiProperty({ description: "Course name", minLength: 1, maxLength: 50 })
  @IsString()
  @Length(1, 50)
  courseName!: string

  @ApiProperty({ description: "Course description" })
  @IsString()
  courseDescription!: string

  @ApiProperty({ description: "Horoscope method ID" })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  horoscopeMethodId!: number

  @ApiProperty({ description: "Horoscope sector", enum: HoroscopeSector })
  @IsEnum(HoroscopeSector)
  horoscopeSector!: HoroscopeSector

  @ApiProperty({ description: "Duration in minutes", minimum: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  durationMin!: number

  @ApiProperty({ description: "Course price" })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price!: Decimal
}
