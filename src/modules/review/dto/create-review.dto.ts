import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateReviewReqDto {
  @ApiProperty()
  @IsString()
  accountId!: string

  @ApiProperty()
  @IsString()
  bookingId!: string

  @ApiProperty()
  @IsString()
  courseId!: string

  @ApiProperty()
  @IsNumber()
  score!: number

  @ApiPropertyOptional()
  @IsString()
  description!: string
}
