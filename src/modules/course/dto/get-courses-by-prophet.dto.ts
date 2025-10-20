import { ApiProperty } from "@nestjs/swagger"
import { HoroscopeSector } from "@prisma/client"

export class GetCoursesByProphetDto {
  @ApiProperty({
    example: "cs_abc123def456",
    description: "Course unique ID",
  })
  id!: string

  @ApiProperty({
    example: "Love Tarot Reading",
    description: "Course name",
  })
  courseName!: string

  @ApiProperty({
    example: "Dev",
    description: "Prophet first name",
  })
  prophetName!: string

  @ApiProperty({
    example: "Prophet",
    description: "Prophet last name",
  })
  prophetLastname!: string

  @ApiProperty({
    example: true,
    description: "Whether the course is publicly available",
  })
  isPublic!: boolean

  @ApiProperty({
    example: 500.0,
    description: "Course price in decimal format",
  })
  price!: number

  @ApiProperty({
    example: 4.5,
    description: "Average rating based on reviews (0-5)",
  })
  rating!: number | null

  @ApiProperty({
    example: "LOVE",
    enum: ["LOVE", "WORK", "STUDY", "MONEY", "LUCK", "FAMILY"],
    description: "Horoscope sector this course covers",
  })
  horoscopeSector!: HoroscopeSector

  @ApiProperty({
    example: 30,
    description: "Course duration in minutes",
  })
  durationMin!: number

  @ApiProperty({
    example: 1,
    description: "Horoscope method ID",
  })
  horoscopeMethodId!: number

  @ApiProperty({
    example: "tarot",
    description: "Horoscope method slug",
  })
  methodSlug!: string

  @ApiProperty({
    example: "Tarot Reading",
    description: "Horoscope method name",
  })
  methodName!: string

  @ApiProperty({
    example: "2025-10-05T12:00:00Z",
    description: "Course creation timestamp",
  })
  createdAt!: Date

  @ApiProperty({
    example: true,
    description: "Whether the course is currently active",
  })
  isActive!: boolean
}
