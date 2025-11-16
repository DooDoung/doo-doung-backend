import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common"
import { BookingRepository, CreateBookingInput } from "./booking.repository"
import { BookingStatus, PayoutStatus, Prisma } from "@prisma/client"
import { PaymentService } from "../payment/payment.service"
import { NanoidService } from "@/common/utils/nanoid"
import { CustomerService } from "../customer/customer.service"
import { TransactionCreatePayload } from "../payment/payment.service"
import { CourseService } from "../course/course.service"
import { PrismaService } from "@/db/prisma.service"
import { CreateBookingResponseDto } from "./dto/create-booking.dto"

export interface CreateBookingPayload {
  accountId: string
  courseId: string
  startDateTime: string
  endDateTime: string
}

export interface BookingCreateDependencies {
  prisma: PrismaService
  repo: BookingRepository
  paymentService: PaymentService
  customerService: CustomerService
  nanoidService: NanoidService
  courseService: CourseService
}

export function createBookingFunction(deps: BookingCreateDependencies) {
  return async function createBooking(
    payload: CreateBookingPayload
  ): Promise<CreateBookingResponseDto> {
    const accountId = payload.accountId
    const customer =
      await deps.customerService.getCustomerByAccountId(accountId)
    const courseId = payload.courseId

    if (!customer || !customer.id) {
      throw new NotFoundException(
        `Customer not found for accountId: ${accountId}`
      )
    }

    const customerId = customer.id
    const id = await deps.nanoidService.generateId()
    const course = await deps.courseService.getCourseForBookingById(courseId)
    const coursePrice = course.price
    const prophetId = course.prophetId

    try {
      const result = await deps.prisma.$transaction(
        async tx => {
          const bookingInput: CreateBookingInput = {
            id: id,
            courseId: courseId,
            customerId: customerId,
            prophetId: prophetId,
            startDateTime: new Date(payload.startDateTime),
            endDateTime: new Date(payload.endDateTime),
            status: BookingStatus.SCHEDULED,
          }

          // create booking
          const booking = await deps.repo.create(bookingInput, tx)

          const bookingId = booking.id
          const transactionPayload: TransactionCreatePayload = {
            bookingId: bookingId,
            status: PayoutStatus.PENDING_PAYOUT,
            amount: coursePrice,
          }

          // create payment transaction
          const transaction = await deps.paymentService.createPayment(
            transactionPayload,
            tx
          )
          return { booking, transaction }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      )
      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`Database error: ${error.message}`)
      }

      throw new InternalServerErrorException(
        "Booking transaction failed, please try again"
      )
    }
  }
}
