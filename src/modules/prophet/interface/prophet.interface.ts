import type { TxAccount } from "@/common/types/payment/tx-account.type"

export interface ProphetDetail {
  lineId?: string | null
  txAccounts: TxAccount[]
}
