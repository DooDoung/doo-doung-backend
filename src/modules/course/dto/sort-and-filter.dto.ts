import { ApiPropertyOptional } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"
import { Type } from "class-transformer"
import { IsOptional, IsString, IsNumber, Min, IsEnum } from "class-validator"

export class FilterAndSortCoursesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort_by?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price_min?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price_max?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  horoscope_method?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(HoroscopeSector)
  horoscope_sector?: HoroscopeSector

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
}
