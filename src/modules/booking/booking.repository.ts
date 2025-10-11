import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { BookingStatus } from "@prisma/client"
import { BookingEntity } from "./interface/core.interface";

export interface CreateBookingInput {
  id: string;
  customerId: string;
  courseId: string;
  prophetId: string;
  startDateTime: Date;
  endDateTime: Date;
  status : BookingStatus
}

@Injectable()
export class BookingRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data : CreateBookingInput) : Promise<BookingEntity>{
    return await this.prisma.booking.create( { data } )
  }
}
