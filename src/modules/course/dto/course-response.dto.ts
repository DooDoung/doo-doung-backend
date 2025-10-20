import { HoroscopeSector } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export class CourseResponseDto {
  id!: string
  courseName!: string
  horoscopeSector!: HoroscopeSector
  durationMin!: number
  price!: Decimal
  isActive!: boolean
  createdAt!: Date
  updatedAt!: Date
}

export class CourseActiveResponseDto {
  id!: string
  isActive!: boolean
}
