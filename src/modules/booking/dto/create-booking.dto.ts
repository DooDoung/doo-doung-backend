import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
