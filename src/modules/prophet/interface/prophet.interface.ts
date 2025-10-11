import type { TxAccount } from "@/common/types/payment/tx-account.type"

export interface ProphetDetail {
  prophetId?: string | null
  lineId?: string | null
  txAccounts: TxAccount[]
}

export interface ProphetAccount {
  id?: string | null
}