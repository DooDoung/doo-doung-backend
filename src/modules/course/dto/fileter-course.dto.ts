import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import { Type } from "class-transformer"
import { IsOptional, IsString, IsNumber, Min, IsEnum } from "class-validator"
import { Decimal } from "@prisma/client/runtime/library"

export class FilterCoursesQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  sort_by?: string

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price_min?: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price_max?: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  horoscope_method?: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(HoroscopeSector)
  horoscope_sector?: HoroscopeSector

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit?: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
}

export class FilterCourseResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  prophetId!: string

  @ApiProperty()
  courseName!: string

  @ApiProperty()
  horoscopeMethodId!: number

  @ApiProperty()
  horoscopeSector!: HoroscopeSector

  @ApiProperty()
  durationMin!: number

  @ApiProperty()
  price!: Decimal

  @ApiProperty()
  isActive!: boolean

  @ApiProperty()
  name!: string

  @ApiProperty()
  lastname!: string

  @ApiProperty()
  lineId!: string
}
