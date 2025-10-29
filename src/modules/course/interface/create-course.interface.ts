import { Decimal } from "@prisma/client/runtime/library"
import { HoroscopeSector } from "@prisma/client"

export interface CreateCourseInterface {
  courseName: string
  courseDescription: string
  horoscopeMethodId: number
  horoscopeSector: HoroscopeSector
  durationMin: number
  price: Decimal
}
