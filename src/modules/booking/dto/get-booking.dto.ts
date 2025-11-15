import { ApiProperty } from "@nestjs/swagger"

export class ProphetDetailDto {
  @ApiProperty({
    example: "dev_prophet_001",
    description: "Prophet unique ID",
  })
  id!: string

  @ApiProperty({
    example: "Dev",
    description: "Prophet first name",
  })
  name!: string

  @ApiProperty({
    example: "Prophet",
    description: "Prophet last name",
  })
  lastname!: string

  @ApiProperty({
    example: "dev_prophet@gmail.com",
    description: "Prophet email address",
  })
  email!: string

  @ApiProperty({
    example: "U1234567890abcd",
    description: "Prophet's LINE ID for communication",
  })
  lineId!: string
}

export class CustomerDetailDto {
  @ApiProperty({
    example: "dev_customer_001",
    description: "Customer unique ID",
  })
  id!: string

  @ApiProperty({
    example: "Dev",
    description: "Customer first name",
  })
  name!: string

  @ApiProperty({
    example: "Customer",
    description: "Customer last name",
  })
  lastname!: string

  @ApiProperty({
    example: "dev_customer@gmail.com",
    description: "Customer email address",
  })
  email!: string
}

export class HoroscopeMethodDto {
  @ApiProperty({
    example: 1,
    description: "Horoscope method ID",
  })
  id!: number

  @ApiProperty({
    example: "tarot",
    description: "Method slug",
  })
  slug!: string

  @ApiProperty({
    example: "Tarot Reading",
    description: "Method name",
  })
  name!: string
}

export class CourseDetailDto {
  @ApiProperty({
    example: "cs_abc123",
    description: "Course unique ID",
  })
  id!: string

  @ApiProperty({
    example: "Basic Tarot Reading",
    description: "Course name",
  })
  courseName!: string

  @ApiProperty({
    example: "LOVE",
    enum: ["LOVE", "WORK", "STUDY", "MONEY", "LUCK", "FAMILY"],
    description: "Horoscope sector focus",
  })
  horoscopeSector!: string

  @ApiProperty({
    example: 30,
    description: "Course duration in minutes",
  })
  durationMin!: number

  @ApiProperty({
    example: 500.0,
    description: "Course price",
  })
  price!: number

  @ApiProperty({
    type: String,
    description: "Horoscope method used for this course",
  })
  method!: string
}

export class PaymentDetailDto {
  @ApiProperty({
    example: "tx_abc123def456",
    description: "Transaction ID (or MOCK_bk_xxx if no transaction)",
  })
  id!: string

  @ApiProperty({
    example: 500.0,
    description: "Amount paid",
  })
  amount!: number

  @ApiProperty({
    example: "PENDING_PAYOUT",
    enum: ["PENDING_PAYOUT", "PAID_OUT"],
    description: "Payment status",
  })
  status!: string

  @ApiProperty({
    example: "2025-10-05T12:00:00Z",
    description: "Payment/Transaction date",
  })
  date!: Date
}

export class GetBookingResponseDto {
  @ApiProperty({
    example: "bk_abc123",
    description: "Booking unique ID",
  })
  id!: string

  @ApiProperty({
    example: "SCHEDULED",
    enum: ["SCHEDULED", "COMPLETED", "FAILED"],
    description: "Current booking status",
  })
  status!: string

  @ApiProperty({
    example: "2025-10-20T10:00:00Z",
    description: "Booking start date and time",
  })
  startDateTime!: Date

  @ApiProperty({
    example: "2025-10-20T10:30:00Z",
    description: "Booking end date and time",
  })
  endDateTime!: Date

  @ApiProperty({
    example: "2025-10-05T12:00:00Z",
    description: "Booking creation timestamp",
  })
  createdAt!: Date

  @ApiProperty({
    type: ProphetDetailDto,
    description: "Prophet details associated with this booking",
  })
  prophet!: ProphetDetailDto

  @ApiProperty({
    type: CustomerDetailDto,
    description: "Customer details associated with this booking",
  })
  customer!: CustomerDetailDto

  @ApiProperty({
    type: CourseDetailDto,
    description: "Course details including horoscope method",
  })
  course!: CourseDetailDto

  @ApiProperty({
    type: PaymentDetailDto,
    description:
      "Payment/Transaction information (includes mock data if no transaction exists)",
  })
  payment!: PaymentDetailDto
}
