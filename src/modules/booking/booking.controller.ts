import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { BookingService, CreateBookingPayload } from './booking.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateBookingRequestDto } from './dto/create-booking.dto';

@ApiTags('booking')
@ApiBearerAuth()
@ApiExtraModels(CreateBookingRequestDto)
@Controller('booking')
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @ApiBody({
    description: 'Booking creation payload',
    type: CreateBookingRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Booking successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'BKG_1234567890ABCD' },
        status: { type: 'string', example: 'scheduled' },
        startDateTime: { type: 'string', example: '2025-10-12T14:00:00.000Z' },
        endDateTime: { type: 'string', example: '2025-10-12T15:00:00.000Z' },
      },
    },
  })
  async post(
    @Body() body: CreateBookingRequestDto,
    @CurrentUser('id') id: string,
  ): Promise<void> {
    const payload: CreateBookingPayload = {
      accountId: id,
      courseId: body.courseId,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
    };

    return this.service.createBooking(payload);
  }
}
