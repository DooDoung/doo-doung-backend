import { HoroscopeSector } from "@prisma/client"

export class CourseResponseDto {
  id!: string
  courseName!: string
  horoscopeSector!: HoroscopeSector
  durationMin!: number
  price!: number
  isActive!: boolean
  createdAt!: Date
  updatedAt!: Date
}

export class CourseActiveResponseDto {
  id!: string
  isActive!: boolean
}
