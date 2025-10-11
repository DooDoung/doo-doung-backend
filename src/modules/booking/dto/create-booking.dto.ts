import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingRequestDto {
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsDateString()
  @IsNotEmpty()
  startDateTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endDateTime!: string;
}