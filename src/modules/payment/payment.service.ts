import { Injectable } from "@nestjs/common"
import { PaymentRepository } from "./payment.repository"
import { NanoidService } from "@/common/utils/nanoid"
import { TransactionEntity } from "./interface/transaction.interface"
import { PayoutStatus, Prisma } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { Tx } from "@/common/types/transaction-client.type"

export interface TransactionCreatePayload {
  bookingId: string
  status: PayoutStatus
  amount: Decimal
}
@Injectable()
export class PaymentService {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly nanoidService: NanoidService
  ) {}

  async createPayment(
    input: TransactionCreatePayload,
    tx?: Tx
  ): Promise<TransactionEntity> {
    const id = await this.nanoidService.generateId()
    const data = {
      id,
      ...input,
    }
    return this.repo.create(data, tx)
  }

  async markPayoutPaid(
    transactionId: string,
    tx?: Tx
  ): Promise<Prisma.BatchPayload> {
    return this.repo.markPayoutPaid(transactionId, tx)
  }
}
