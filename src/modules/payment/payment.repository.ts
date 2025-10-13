import { Injectable } from "@nestjs/common"
import { PayoutStatus } from "@prisma/client"
import { PrismaService } from "@/db/prisma.service"
import { TransactionEntity } from "./interface/transaction.interface"
import { Decimal } from "@prisma/client/runtime/library"
import { Tx } from "@/common/types/transaction-client.type"

export interface TransactionCreateInput {
  id: string
  bookingId: string
  status: PayoutStatus
  amount: Decimal
}
@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TransactionEntity | null> {
    // TO DO: must match owner id (prophet/customer)
    return this.prisma.transaction.findUnique({ where: { id } })
  }

  async create(data: TransactionCreateInput): Promise<TransactionEntity> {
    return this.prisma.transaction.create({ data })
  }

  async markPayoutPaid(
    transactionId: string,
    tx?: Tx
  ): Promise<TransactionEntity> {
    const db = tx ?? this.prisma
    return db.transaction.update({
      where: { id: transactionId, status: PayoutStatus.PENDING_PAYOUT },
      data: { status: PayoutStatus.PAID_OUT, updatedAt: new Date() },
    })
  }
}
