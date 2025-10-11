import { PayoutStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface TransactionEntity {
  id: string;
  bookingId: string;
  status: PayoutStatus;
  amount: Decimal;
  createdAt: Date;
  updatedAt: Date;
}



