import { Bank } from "@prisma/client"

export type TxAccount = {
  bank: Bank
  accountName: string
  accountNumber: string
}
