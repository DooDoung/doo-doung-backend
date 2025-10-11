import { Injectable, NotFoundException } from "@nestjs/common"
import { BookingRepository, CreateBookingInput } from "./booking.repository"
import { BookingStatus, PayoutStatus } from "@prisma/client"
import { PaymentService } from "../payment/payment.service"
import { NanoidService } from "@/common/utils/nanoid"
import { CustomerService } from "../customer/customer.service"
import { ProphetService } from "../prophet/prophet.service"
import { TransactionCreatePayload } from "../payment/payment.service"
import { CourseService } from "../course/course.service"

export interface CreateBookingPayload {
  accountId: string;
  courseId: string;
  startDateTime: string;
  endDateTime: string;
}

@Injectable()
export class BookingService {
  constructor(
    private readonly repo: BookingRepository,
    private readonly paymentService : PaymentService,
    private readonly customerService : CustomerService,
    private readonly prophetService : ProphetService,
    private readonly nanoidService : NanoidService,
    private readonly courseService : CourseService
  ) {}

  async createBooking(payload : CreateBookingPayload): Promise<void> {
    // TO DO: get prophet id and customer id
    const accountId = payload.accountId
    const customer = (await this.customerService.getCustomerByAccountId(accountId))
    const prophet = (await this.prophetService.getProphetByAccountId(accountId))
    const courseId = payload.courseId

    if (!customer || !customer.id) {
      throw new NotFoundException(`Customer not found for accountId: ${accountId}`);
    }

    if (!prophet || !prophet.id) {
      throw new NotFoundException(`Prophet not found for accountId: ${accountId}`);
    }

    const customerId = customer.id
    const prophetId = prophet.id
    const id = await this.nanoidService.generateId()

    const input : CreateBookingInput = {
      id: id, 
      courseId: courseId,
      customerId: customerId,
      prophetId: prophetId,
      startDateTime: new Date(payload.startDateTime),
      endDateTime: new Date(payload.endDateTime),
      status: BookingStatus.SCHEDULED
    }

    const booking = await this.repo.create(input)
    const bookingId = booking.id

    const coursePrice = await this.courseService.getCoursePriceById(courseId)

    const transactionPayload : TransactionCreatePayload = {
      bookingId: bookingId,
      status : PayoutStatus.PENDING_PAYOUT,
      amount : coursePrice
    }
    await this.paymentService.createPayment(transactionPayload)
  }
}
