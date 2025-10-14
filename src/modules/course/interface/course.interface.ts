import { Decimal } from "@prisma/client/runtime/library"

export interface CourseForBookingResponse {
    prophetId: string
    price: Decimal
}