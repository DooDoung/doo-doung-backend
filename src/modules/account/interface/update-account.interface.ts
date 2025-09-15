import { Sex, ZodiacSign, Role } from "@prisma/client"
import { TxAccount } from "@/common/types/payment/tx-account.type"

export interface BaseUpdateAccountDto {
  id: string
  role: Role
  username?: string | null
  password?: string | null
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  gender?: Sex | null
  email?: string | null
  profileUrl?: string | null
}
export interface CustomerUpdateAccountDto extends BaseUpdateAccountDto {
  birthDate?: Date | null // use string to make both into date when create to db
  birthTime?: Date | null // in pattern 1970-01-01T${birthTime}Z
  zodiacSign?: ZodiacSign | null
}
export interface ProphetUpdateAccountDto extends BaseUpdateAccountDto {
  lineId?: string | null
  txAccounts?: TxAccount[] | null
}
export interface CustomerUpdateAccountDtoInput extends BaseUpdateAccountDto {
  birthDate?: string | null // use string to make both into date when create to db
  birthTime?: string | null // in pattern 1970-01-01T${birthTime}Z
  zodiacSign?: ZodiacSign | null
}
export type UpdateAccountDto =
  | CustomerUpdateAccountDto
  | ProphetUpdateAccountDto
