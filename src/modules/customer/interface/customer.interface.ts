export interface CustomerDetail {
  zodiacSign?: string | null
  birthDate?: Date | null
  birthTime?: Date | null
  isPublic?: boolean | null
}

export interface CustomerBasic {
  id?: string | null
  isPublic?: boolean | null
}

export interface CustomerAccount {
  id?: string | null
  accountId?: string | null
}
