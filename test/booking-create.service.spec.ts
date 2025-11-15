import {
  createBookingFunction,
  CreateBookingPayload,
} from "../src/modules/booking/booking-create.service"
import { BookingStatus, PayoutStatus, Prisma } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common"

describe("BookingCreateService - createBooking (100% Coverage)", () => {
  let createBooking: (payload: CreateBookingPayload) => Promise<any>
  let mockDeps: Record<string, any>

  beforeEach(() => {
    mockDeps = {
      prisma: {
        $transaction: jest.fn(),
      },
      repo: {
        create: jest.fn(),
      },
      paymentService: {
        createPayment: jest.fn(),
      },
      customerService: {
        getCustomerByAccountId: jest.fn(),
      },
      nanoidService: {
        generateId: jest.fn(),
      },
      courseService: {
        getCourseForBookingById: jest.fn(),
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createBooking = createBookingFunction(mockDeps as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should successfully create a booking with transaction", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_123",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    const mockCustomer = { id: "customer_789", accountId: "acc_123" }
    const mockCourse = {
      id: "course_456",
      prophetId: "prophet_101",
      price: new Decimal(500),
    }
    const mockBookingId = "booking_xyz"
    const mockBooking = {
      id: mockBookingId,
      customerId: mockCustomer.id,
      courseId: mockCourse.id,
      prophetId: mockCourse.prophetId,
      startDateTime: new Date(payload.startDateTime),
      endDateTime: new Date(payload.endDateTime),
      status: BookingStatus.SCHEDULED,
    }
    const mockTransaction = {
      id: "transaction_abc",
      bookingId: mockBookingId,
      status: PayoutStatus.PENDING_PAYOUT,
      amount: mockCourse.price,
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue(
      mockCustomer
    )
    mockDeps.nanoidService.generateId.mockResolvedValue(mockBookingId)
    mockDeps.courseService.getCourseForBookingById.mockResolvedValue(mockCourse)
    mockDeps.prisma.$transaction.mockImplementation(async (callback: any) => {
      mockDeps.repo.create.mockResolvedValue(mockBooking)
      mockDeps.paymentService.createPayment.mockResolvedValue(mockTransaction)
      return callback({})
    })

    const result = await createBooking(payload)

    expect(result).toEqual({
      booking: mockBooking,
      transaction: mockTransaction,
    })
    expect(
      mockDeps.customerService.getCustomerByAccountId
    ).toHaveBeenCalledWith(payload.accountId)
    expect(mockDeps.nanoidService.generateId).toHaveBeenCalled()
    expect(mockDeps.courseService.getCourseForBookingById).toHaveBeenCalledWith(
      payload.courseId
    )
  })

  it("should throw NotFoundException when customer is null", async () => {
    const payload: CreateBookingPayload = {
      accountId: "non_existent",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue(null)

    await expect(createBooking(payload)).rejects.toThrow(NotFoundException)
    await expect(createBooking(payload)).rejects.toThrow(
      `Customer not found for accountId: ${payload.accountId}`
    )
  })

  it("should throw NotFoundException when customer has no id", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_123",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue({
      accountId: "acc_123",
      id: undefined,
    })

    await expect(createBooking(payload)).rejects.toThrow(NotFoundException)
  })

  it("should throw NotFoundException when customer.id is empty string", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_456",
      courseId: "course_789",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue({
      accountId: "acc_456",
      id: "",
    })

    await expect(createBooking(payload)).rejects.toThrow(NotFoundException)
    await expect(createBooking(payload)).rejects.toThrow(
      `Customer not found for accountId: ${payload.accountId}`
    )
  })

  it("should throw BadRequestException for Prisma database errors", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_123",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue({
      id: "customer_789",
    })
    mockDeps.nanoidService.generateId.mockResolvedValue("booking_xyz")
    mockDeps.courseService.getCourseForBookingById.mockResolvedValue({
      id: "course_456",
      prophetId: "prophet_101",
      price: new Decimal(500),
    })

    const dbError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "6.16.0",
      }
    )

    mockDeps.prisma.$transaction.mockRejectedValue(dbError)

    await expect(createBooking(payload)).rejects.toThrow(BadRequestException)
    await expect(createBooking(payload)).rejects.toThrow(/Database error:/)
  })

  it("should throw InternalServerErrorException for unknown errors", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_123",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue({
      id: "customer_789",
    })
    mockDeps.nanoidService.generateId.mockResolvedValue("booking_xyz")
    mockDeps.courseService.getCourseForBookingById.mockResolvedValue({
      id: "course_456",
      prophetId: "prophet_101",
      price: new Decimal(500),
    })

    mockDeps.prisma.$transaction.mockRejectedValue(new Error("Network timeout"))

    await expect(createBooking(payload)).rejects.toThrow(
      InternalServerErrorException
    )
    await expect(createBooking(payload)).rejects.toThrow(
      "Booking transaction failed, please try again"
    )
  })

  it("should pass correct booking data to repository", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_123",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue({
      id: "customer_789",
    })
    mockDeps.nanoidService.generateId.mockResolvedValue("booking_xyz")
    mockDeps.courseService.getCourseForBookingById.mockResolvedValue({
      id: "course_456",
      prophetId: "prophet_101",
      price: new Decimal(500),
    })

    mockDeps.prisma.$transaction.mockImplementation(async (callback: any) => {
      mockDeps.repo.create.mockResolvedValue({ id: "booking_xyz" })
      mockDeps.paymentService.createPayment.mockResolvedValue({ id: "tx_123" })
      return callback({})
    })

    await createBooking(payload)

    expect(mockDeps.repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "booking_xyz",
        courseId: "course_456",
        customerId: "customer_789",
        prophetId: "prophet_101",
        status: BookingStatus.SCHEDULED,
      }),
      expect.anything()
    )
  })

  it("should use Serializable isolation level", async () => {
    const payload: CreateBookingPayload = {
      accountId: "acc_123",
      courseId: "course_456",
      startDateTime: "2025-12-01T10:00:00Z",
      endDateTime: "2025-12-01T11:00:00Z",
    }

    mockDeps.customerService.getCustomerByAccountId.mockResolvedValue({
      id: "customer_789",
    })
    mockDeps.nanoidService.generateId.mockResolvedValue("booking_xyz")
    mockDeps.courseService.getCourseForBookingById.mockResolvedValue({
      id: "course_456",
      prophetId: "prophet_101",
      price: new Decimal(500),
    })

    mockDeps.prisma.$transaction.mockImplementation(async (callback: any) => {
      mockDeps.repo.create.mockResolvedValue({ id: "booking_xyz" })
      mockDeps.paymentService.createPayment.mockResolvedValue({ id: "tx_123" })
      return callback({})
    })

    await createBooking(payload)

    expect(mockDeps.prisma.$transaction).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        isolationLevel: "Serializable",
      })
    )
  })
})
