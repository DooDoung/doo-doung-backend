import { Injectable } from "@nestjs/common"
import { PayoutStatus} from "@prisma/client"
import { PrismaService } from "../../db/prisma.service"
import { TransactionEntity } from "./interface/transaction.interface"

export interface TransactionCreateInput {
  id: string;
  bookingId: string;
  status: PayoutStatus;
  amount: number;
}
@Injectable()
export class PaymentRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findById(id: string): Promise<TransactionEntity | null> {
    // TO DO: must match owner id (prophet/customer)
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async create(data: TransactionCreateInput): Promise<TransactionEntity> {
    return this.prisma.transaction.create({ data });
  }

}
