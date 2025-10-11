import { Injectable } from "@nestjs/common"
import { PaymentRepository } from "./payment.repository"
import { NanoidService } from "@/common/utils/nanoid"
import { TransactionEntity } from "./interface/transaction.interface"
import { PayoutStatus } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export interface TransactionCreatePayload {
  bookingId: string;
  status: PayoutStatus;
  amount: Decimal;
}
@Injectable()
export class PaymentService {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly nanoidService : NanoidService
  ) {}

  async createPayment(input : TransactionCreatePayload): Promise<TransactionEntity> {
    const id = await this.nanoidService.generateId()
    const data = {
      id, 
      ...input
    }
    return this.repo.create(data)
  }
}
