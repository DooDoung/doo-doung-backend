import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsBoolean } from "class-validator"
import { Transform } from "class-transformer"

export class GetCoursesQueryDto {
  @ApiPropertyOptional({ description: "Filter by active status" })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isActive?: boolean
}