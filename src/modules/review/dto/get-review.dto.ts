import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class ReviewDto {
  @ApiProperty()
  score!: number

  @ApiPropertyOptional({ nullable: true })
  description!: string | null

  @ApiProperty()
  courseName!: string
}

export class GetReviewsResponseDto {
  @ApiProperty({ type: [ReviewDto] })
  reviews!: ReviewDto[]
}
