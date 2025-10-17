import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common"
import { BookingRepository, CreateBookingInput } from "./booking.repository"
import { BookingStatus, PayoutStatus, Prisma } from "@prisma/client"
import { PaymentService } from "../payment/payment.service"
import { NanoidService } from "@/common/utils/nanoid"
import { CustomerService } from "../customer/customer.service"
import { ProphetService } from "../prophet/prophet.service"
import { TransactionCreatePayload } from "../payment/payment.service"
import { CourseService } from "../course/course.service"
import { PrismaService } from "@/db/prisma.service"
import { BookingCompleteResponseDto } from "./dto/complete-booking.dto"
import { CreateBookingResponseDto } from "./dto/create-booking.dto"
import { GetBookingResponseDto } from "./dto/get-booking.dto"

export interface CreateBookingPayload {
  accountId: string
  courseId: string
  startDateTime: string
  endDateTime: string
}

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: BookingRepository,
    private readonly paymentService: PaymentService,
    private readonly customerService: CustomerService,
    private readonly prophetService: ProphetService,
    private readonly nanoidService: NanoidService,
    private readonly courseService: CourseService
  ) {}

  async createBooking(
    payload: CreateBookingPayload
  ): Promise<CreateBookingResponseDto> {
    const accountId = payload.accountId
    const customer =
      await this.customerService.getCustomerByAccountId(accountId)
    const courseId = payload.courseId

    if (!customer || !customer.id) {
      throw new NotFoundException(
        `Customer not found for accountId: ${accountId}`
      )
    }

    const customerId = customer.id
    const id = await this.nanoidService.generateId()
    const course = await this.courseService.getCourseForBookingById(courseId)
    const coursePrice = course.price
    const prophetId = course.prophetId

    try {
      const result = await this.prisma.$transaction(
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
          const booking = await this.repo.create(bookingInput, tx)

          const bookingId = booking.id
          const transactionPayload: TransactionCreatePayload = {
            bookingId: bookingId,
            status: PayoutStatus.PENDING_PAYOUT,
            amount: coursePrice,
          }

          // create payment transaction
          const transaction = await this.paymentService.createPayment(
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

  async completeBooking(
    bookingId: string,
    actingProphetId: string
  ): Promise<BookingCompleteResponseDto | null> {
    return this.prisma.$transaction(
      async tx => {
        const bookingInfo = await this.repo.getBookingById(
          bookingId,
          {
            id: true,
            status: true,
            prophetId: true,
            transaction: {
              select: { id: true, amount: true, payoutStatus: true },
            },
          },
          tx
        )
        if (!bookingInfo) throw new BadRequestException("Booking not found.")
        if (bookingInfo.prophetId !== actingProphetId)
          throw new ForbiddenException("Not allowed.")
        if (bookingInfo.status !== BookingStatus.SCHEDULED)
          throw new BadRequestException(
            "Only scheduled booking can be completed."
          )
        if (!bookingInfo.transaction)
          throw new BadRequestException("No transaction found.")
        if (
          bookingInfo.transaction.payoutStatus !== PayoutStatus.PENDING_PAYOUT
        )
          throw new BadRequestException("Payout already processed or invalid.")

        await this.repo.updateBookingStatus(
          bookingId,
          BookingStatus.COMPLETED,
          tx
        )

        const payout = await this.paymentService.markPayoutPaid(
          bookingInfo.transaction.id,
          tx
        )
        if (payout.count !== 1)
          throw new BadRequestException("Payout state changed, try again.")

        const updatedBalance = await this.prophetService.incrementBalance(
          bookingInfo.prophetId,
          bookingInfo.transaction.amount,
          tx
        )
        if (updatedBalance.count !== 1)
          throw new BadRequestException("State changed, try again.")

        return this.repo.getBookingById(
          bookingId,
          {
            id: true,
            status: true,
            prophetId: true,
            transaction: {
              select: { id: true, amount: true, payoutStatus: true },
            },
            prophet: {
              select: { balance: true },
            },
          },
          tx
        )
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
  }

  async getBookingsByUserId(userId: string): Promise<GetBookingResponseDto[]> {
    // Get the account to determine role
    const account = await this.prisma.account.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!account) {
      throw new NotFoundException("User not found")
    }

    if (account.role === "PROPHET") {
      // Get bookings where the user is the prophet
      const bookings = await this.prisma.booking.findMany({
        where: { prophetId: userId },
        include: {
          prophet: {
            select: {
              id: true,
              account: {
                select: {
                  email: true,
                  userDetail: {
                    select: {
                      name: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
          },
          customer: {
            select: {
              id: true,
              account: {
                select: {
                  email: true,
                  userDetail: {
                    select: {
                      name: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              courseName: true,
              horoscopeSector: true,
              durationMin: true,
              price: true,
            },
          },
        },
      })

      return bookings.map(booking => ({
        id: booking.id,
        status: booking.status,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
        createdAt: booking.createdAt,
        prophet: {
          id: booking.prophet.id,
          name: booking.prophet.account.userDetail?.name || "",
          lastname: booking.prophet.account.userDetail?.lastname || "",
          email: booking.prophet.account.email,
        },
        customer: {
          id: booking.customer.id,
          name: booking.customer.account.userDetail?.name || "",
          lastname: booking.customer.account.userDetail?.lastname || "",
          email: booking.customer.account.email,
        },
        course: {
          id: booking.course.id,
          courseName: booking.course.courseName,
          horoscopeSector: booking.course.horoscopeSector,
          durationMin: booking.course.durationMin,
          price: booking.course.price.toNumber(),
        },
      }))
    } else if (account.role === "CUSTOMER") {
      // Get bookings where the user is the customer
      const customer = await this.prisma.customer.findUnique({
        where: { accountId: userId },
      })

      if (!customer) {
        throw new NotFoundException("Customer profile not found")
      }

      const bookings = await this.prisma.booking.findMany({
        where: { customerId: customer.id },
        include: {
          prophet: {
            select: {
              id: true,
              account: {
                select: {
                  email: true,
                  userDetail: {
                    select: {
                      name: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
          },
          customer: {
            select: {
              id: true,
              account: {
                select: {
                  email: true,
                  userDetail: {
                    select: {
                      name: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              courseName: true,
              horoscopeSector: true,
              durationMin: true,
              price: true,
            },
          },
        },
      })

      return bookings.map(booking => ({
        id: booking.id,
        status: booking.status,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
        createdAt: booking.createdAt,
        prophet: {
          id: booking.prophet.id,
          name: booking.prophet.account.userDetail?.name || "",
          lastname: booking.prophet.account.userDetail?.lastname || "",
          email: booking.prophet.account.email,
        },
        customer: {
          id: booking.customer.id,
          name: booking.customer.account.userDetail?.name || "",
          lastname: booking.customer.account.userDetail?.lastname || "",
          email: booking.customer.account.email,
        },
        course: {
          id: booking.course.id,
          courseName: booking.course.courseName,
          horoscopeSector: booking.course.horoscopeSector,
          durationMin: booking.course.durationMin,
          price: booking.course.price.toNumber(),
        },
      }))
    }

    throw new BadRequestException("Invalid user role")
  }
}
