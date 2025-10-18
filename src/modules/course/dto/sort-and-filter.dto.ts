import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import { Type } from "class-transformer"
import { IsOptional, IsString, IsNumber, Min, IsEnum } from "class-validator"

export class FilterAndSortCoursesDto {
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
