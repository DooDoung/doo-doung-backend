import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, PayoutStatus } from "@prisma/client"
import { Decimal } from '@prisma/client/runtime/library';

export class CreateBookingRequestDto {
  @ApiProperty({
    description: 'The ID of the course to book.',
    example: 'CRS_1234567890ABCD',
  })
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @ApiProperty({
    description: 'Booking start time in ISO 8601 format.',
    example: '2025-10-12T14:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDateTime!: string;

  @ApiProperty({
    description: 'Booking end time in ISO 8601 format.',
    example: '2025-10-12T15:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDateTime!: string;
}

// booking-response.dto.ts

export class BookingResponseDto {
  @ApiProperty({ example: 'BKG_1234567890ABCD' })
  id!: string;

  @ApiProperty({ example: 'CRS_1234567890ABCD' })
  courseId!: string;

  @ApiProperty({ example: 'CUS_9876543210ABCD' })
  customerId!: string;

  @ApiProperty({ example: 'PRO_1234567890ABCD' })
  prophetId!: string;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.SCHEDULED })
  status!: BookingStatus;

  @ApiProperty({ example: '2025-10-12T14:00:00.000Z' })
  startDateTime!: Date;

  @ApiProperty({ example: '2025-10-12T15:00:00.000Z' })
  endDateTime!: Date;
}

export class TransactionResponseDto {
  @ApiProperty({ example: 'TRX_ABC123' })
  id!: string;

  @ApiProperty({ example: 'BKG_1234567890ABCD' })
  bookingId!: string;

  @ApiProperty({ enum: PayoutStatus, example: PayoutStatus.PENDING_PAYOUT })
  status!: PayoutStatus;

  @ApiProperty({ example: 100.00 })
  amount!: Decimal;
}

export class CreateBookingResponseDto {
  @ApiProperty({ type: () => BookingResponseDto })
  booking!: BookingResponseDto;

  @ApiProperty({ type: () => TransactionResponseDto })
  transaction!: TransactionResponseDto;
}

