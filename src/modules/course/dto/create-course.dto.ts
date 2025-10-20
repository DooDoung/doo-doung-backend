import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import {
  IsBoolean,
  IsEnum,
  IsString,
  Length,
  IsNotEmpty,
} from "class-validator"
import { Transform } from "class-transformer"

export class CreateCourseBodyDto {
  @ApiProperty({
    description: "The name of the course",
    example: "Introduction to Natal Charts",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  courseName!: string

  @ApiProperty({
    description: "The ID of the horoscope method used in this course",
    example: 1,
  })
  @IsNotEmpty()
  horoscopeMethodId!: number

  @ApiProperty({
    description: "Horoscope sector this course focuses on",
    enum: HoroscopeSector,
    example: HoroscopeSector.LOVE,
  })
  @IsNotEmpty()
  @IsEnum(HoroscopeSector)
  horoscopeSector!: HoroscopeSector

  @ApiProperty({
    description: "Duration of the course in minutes",
    example: 90,
  })
  @IsNotEmpty()
  durationMin!: number

  @ApiProperty({
    description: "Price of the course (up to 2 decimal places)",
    example: "49.99",
  })
  @IsNotEmpty()
  price!: Decimal

  @ApiProperty({
    description: "Whether the course is active and visible",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === "boolean") return value
    if (typeof value === "string") return value.toLowerCase() === "true"
    return false
  })
  isActive!: boolean
}
