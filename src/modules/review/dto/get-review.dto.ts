import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class ReviewDto {
  @ApiProperty({ example: 5 })
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
