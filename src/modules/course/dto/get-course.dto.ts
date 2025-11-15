import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { IsEnum, IsString, Length, Matches } from "class-validator"

export class GetCourseDto {
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
  horoscopeMethod!: string

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
}

export class GetCourseResponseDto extends GetCourseDto {
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
