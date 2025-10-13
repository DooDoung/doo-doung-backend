import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { BookingStatus, Prisma } from "@prisma/client"
import { BookingEntity } from "./interface/core.interface"
import { Tx } from "@/common/types/transaction-client.type"

export interface CreateBookingInput {
  id: string
  customerId: string
  courseId: string
  prophetId: string
  startDateTime: Date
  endDateTime: Date
  status: BookingStatus
}

@Injectable()
export class BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookingInput): Promise<BookingEntity> {
    return await this.prisma.booking.create({ data })
  }

  getBookingById<S extends Prisma.BookingSelect>(
    id: string,
    select: S,
    tx?: Tx
  ): Promise<Prisma.BookingGetPayload<{ select: S }> | null> {
    const db = tx ?? this.prisma
    return db.booking.findUnique({
      where: { id },
      select,
    })
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus, tx?: Tx) {
    const db = tx ?? this.prisma
    return db.booking.update({
      where: { id: bookingId, status: BookingStatus.SCHEDULED },
      data: { status: status, updatedAt: new Date() },
    })
  }
}
