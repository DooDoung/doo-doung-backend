import { Controller, Post, Body, Param } from "@nestjs/common"
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiParam,
  ApiOkResponse,
} from "@nestjs/swagger"
import { BookingService, CreateBookingPayload } from "./booking.service"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { CreateBookingRequestDto, CreateBookingResponseDto } from "./dto/create-booking.dto"
import { BookingCompleteResponseDto } from "./dto/complete-booking.dto"

@ApiTags("booking")
@ApiBearerAuth()
@ApiExtraModels(CreateBookingRequestDto)
@Controller("booking")
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @ApiBody({
    description: "Booking creation payload",
    type: CreateBookingRequestDto,
  })
  @ApiCreatedResponse({
    description: "Booking and Transaction are successfully created.",
    type: CreateBookingResponseDto
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
}
