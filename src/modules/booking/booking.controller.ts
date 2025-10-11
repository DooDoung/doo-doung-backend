import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
} from "@nestjs/common"
import { BookingService, CreateBookingPayload } from "./booking.service"
import { GetBookingResponseDto } from "./dto/get-booking.dto"
import {
  ApiOkResponse,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { CreateBookingRequestDto } from "./dto/create-booking.dto"

@ApiTags("booking")
@ApiExtraModels(
  // To be filled with dto
)
@Controller("booking")
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @ApiBody(
    { type: [CreateBookingRequestDto] }
  )
  async post(
    @Body() body: CreateBookingRequestDto,
    @CurrentUser("id") id: string
  ): Promise<void> {
    const payload: CreateBookingPayload = {
      accountId: id,
      courseId: body.courseId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime
    }
    
    return await this.service.createBooking(payload)
  }
}
