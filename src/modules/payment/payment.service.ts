import { Injectable } from "@nestjs/common"
import { PaymentRepository } from "./payment.repository"
import { NanoidService } from "@/common/utils/nanoid"
import { TransactionEntity } from "./interface/transaction.interface"
import { PayoutStatus } from "@prisma/client"

export interface TransactionCreatePayload {
  bookingId: string;
  status: PayoutStatus;
  amount: number;
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
