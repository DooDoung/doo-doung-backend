import type { TxAccount } from "@/common/types/payment/tx-account.type"
import { Decimal } from "@prisma/client/runtime/library"

export interface ProphetDetail {
  lineId?: string | null
  txAccounts: TxAccount[]
}

export interface ProphetBasic {
  id?: string | null
}

export interface ProphetEntity {
  id: string
  accountId: string
  lineId: string
  balance: Decimal
  createdAt: Date
  updatedAt: Date
}
