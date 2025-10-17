import { Controller, Post, Body, Param, Get, UseGuards } from "@nestjs/common"
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from "@nestjs/swagger"
import { BookingService, CreateBookingPayload } from "./booking.service"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import {
  CreateBookingRequestDto,
  CreateBookingResponseDto,
} from "./dto/create-booking.dto"
import { BookingCompleteResponseDto } from "./dto/complete-booking.dto"
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard"
import { GetBookingResponseDto } from "./dto/get-booking.dto"
import { Public } from "@/common/decorators/public.decorator"

@ApiTags("booking")
@ApiBearerAuth()
@ApiExtraModels(CreateBookingRequestDto, GetBookingResponseDto)
@Controller("booking")
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @ApiBody({
    description: "Booking creation payload",
    type: CreateBookingRequestDto,
  })
  @ApiCreatedResponse({
    description: "Booking and Transaction are successfully created.",
    type: CreateBookingResponseDto,
  })
  async post(
    @Body() body: CreateBookingRequestDto,
    @CurrentUser("id") id: string
  ): Promise<CreateBookingResponseDto> {
    const payload: CreateBookingPayload = {
      accountId: id,
      courseId: body.courseId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
    }

    return this.service.createBooking(payload)
  }

  @Post(":bookingId/complete")
  @ApiParam({ name: "bookingId", type: String })
  @ApiOkResponse({
    description: "Booking marked as COMPLETED and payout processed.",
    type: BookingCompleteResponseDto,
  })
  async postBookingComplete(
    @Param("bookingId") bookingId: string,
    @CurrentUser("id") prophetId: string
  ): Promise<BookingCompleteResponseDto | null> {
    return this.service.completeBooking(bookingId, prophetId)
  }

  @Public()
  @Get(":accountId")
  @ApiParam({
    name: "accountId",
    type: String,
    description: "The account ID to fetch bookings for",
    example: "dev_prophet_001",
  })
  @ApiOperation({
    summary: "Get all bookings for a specific account",
    description:
      "Retrieves all bookings associated with the specified account. If account is a prophet, returns bookings where they are the prophet. If account is a customer, returns bookings where they are the customer.",
  })
  @ApiOkResponse({
    type: [GetBookingResponseDto],
    description: "List of bookings with prophet and customer details",
    schema: {
      example: [
        {
          id: "bk_abc123",
          status: "SCHEDULED",
          startDateTime: "2025-10-20T10:00:00Z",
          endDateTime: "2025-10-20T10:30:00Z",
          createdAt: "2025-10-05T12:00:00Z",
          prophet: {
            id: "dev_prophet_001",
            name: "Dev",
            lastname: "Prophet",
            email: "dev_prophet@gmail.com",
          },
          customer: {
            id: "dev_customer_001",
            name: "Dev",
            lastname: "Customer",
            email: "dev_customer@gmail.com",
          },
          course: {
            id: "cs_001",
            courseName: "Basic Tarot Reading",
            horoscopeSector: "LOVE",
            durationMin: 30,
            price: 500,
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: "Account not found or no bookings available",
    schema: {
      example: {
        statusCode: 404,
        message: "User not found",
        error: "Not Found",
      },
    },
  })
  async getBookings(
    @Param("accountId") accountId: string
  ): Promise<GetBookingResponseDto[]> {
    return this.service.getBookingsByUserId(accountId)
  }
}
