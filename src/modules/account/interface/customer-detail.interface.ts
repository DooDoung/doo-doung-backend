import { Bank, Role } from "@prisma/client"
import { ZodiacSign } from "@prisma/client"

export interface BaseAccountDto {
  id: string
  //   userDetailId: Int32Array
  username: string
  email: string
  role: Role
  phoneNumber?: string | null
  gender?: string | null
  createdAt: Date
  updatedAt: Date
  profileUrl: string | null
  passwordHash: string
}

export type TxAccountDto = {
  txAccountDtoId: string
  bank: Bank
  accountName: string
  accountNumber: string
}

export interface CustomerAccountDto extends BaseAccountDto {
  zodiacSign?: string | null
  birthDate?: Date | null
  birthTime?: Date | null
}

export interface ProphetAccountDto extends BaseAccountDto {
  lineId?: string | null
  txAccounts?: TxAccountDto[]
}

export interface CustomerDetail {
  zodiacSign: ZodiacSign
  birthDate: string // use string to make both into date when create to db
  birthTime: string // in pattern 1970-01-01T${birthTime}Z
}

//use this inter for only recieve input
export interface CustomerDetailDtoInput extends BaseAccountDto {
  zodiacSign: ZodiacSign
  birthDate: string // use string to make both into date when create to db
  birthTime: string // in pattern 1970-01-01T${birthTime}Z
}

export type RegisterDto = CustomerAccountDto | ProphetAccountDto
