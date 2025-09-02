import { Role, Bank } from "@prisma/client"

export interface BaseAccount {
  username: string
  email: string
  role: Role
  phoneNumber?: string | null
  gender?: string | null
}

export interface CustomerAccount extends BaseAccount {
  zodiacSign?: string | null
  birthDate?: Date | null
  birthTime?: Date | null
}

export type TxAccount = {
  bank: Bank
  accountName: string
  accountNumber: string
}

export interface ProphetAccount extends BaseAccount {
  lineId?: string | null
  txAccounts?: TxAccount[]
}

export type MeResponse = CustomerAccount | ProphetAccount
