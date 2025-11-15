import { HoroscopeSector } from "@prisma/client"

export interface GetCoursesByProphet {
  id: string
  courseName: string
  courseDescription: string
  prophetName: string
  prophetLastname: string
  isPublic: boolean
  price: number
  rating: number | null
  horoscopeSector: HoroscopeSector
  durationMin: number
  horoscopeMethod: string
  createdAt: Date
  isActive: boolean
}
