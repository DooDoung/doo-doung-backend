import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import {
  IsEnum,
  IsString,
  Length,
  IsNumber,
  IsPositive,
  IsOptional,
} from "class-validator"
import { Type } from "class-transformer"

export class UpdateCourseDto {
  @ApiProperty({
    description: "Course name",
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsString()
  @Length(1, 50)
  @IsOptional()
  courseName?: string

  @ApiProperty({
    description: "Course description",
    required: false,
  })
  @IsString()
  @IsOptional()
  courseDescription?: string

  @ApiProperty({
    description: "Horoscope sector",
    enum: HoroscopeSector,
    required: false,
  })
  @IsEnum(HoroscopeSector)
  @IsOptional()
  horoscopeSector?: HoroscopeSector

  @ApiProperty({
    description: "Duration in minutes",
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  durationMin?: number

  @ApiProperty({
    description: "Course description",
    maxLength: 1000,
    required: false,
  })
  @IsString()
  @Length(0, 1000)
  @IsOptional()
  description?: string

  @ApiProperty({
    description: "Course price",
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  price?: number
}
