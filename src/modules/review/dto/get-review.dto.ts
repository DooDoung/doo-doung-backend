import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class ReviewDto {
  @ApiProperty()
  score!: number

  @ApiPropertyOptional({ nullable: true })
  description!: string | null

  @ApiProperty()
  courseName!: string

  @ApiProperty()
  updatedAt!: Date
}

export class GetReviewsResponseDto {
  @ApiProperty({ type: [ReviewDto] })
  reviews!: ReviewDto[]
}

export class ReviewForCourseDto extends ReviewDto {
  @ApiProperty()
  userName!: string

  @ApiProperty()
  profileUrl!: string
}

export class GetReviewsForCourseResponseDto {
  @ApiProperty({ type: [ReviewForCourseDto] })
  reviews!: ReviewForCourseDto[]
}
