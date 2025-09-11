import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BaseAccountDto {
  @ApiProperty()
  username!: string

  @ApiProperty()
  email!: string

  @ApiPropertyOptional()
  phoneNumber?: string | null

  @ApiPropertyOptional()
  gender?: string | null

  @ApiPropertyOptional()
  profileUrl?: string | null
}

export class CustomerAccountDto extends BaseAccountDto {
  @ApiProperty()
  zodiacSign!: string | null

  @ApiPropertyOptional()
  birthDate?: Date | null

  @ApiPropertyOptional()
  birthTime?: Date | null
}

export class ProphetAccountDto extends BaseAccountDto {
  @ApiPropertyOptional()
  lineId?: string | null

  @ApiProperty()
  txAccounts?: {
    bank: string
    accountName: string
    accountNumber: string
  }[]
}

export class LimitedCustomerAccountDto {
  @ApiProperty()
  username!: string

  @ApiPropertyOptional()
  profileUrl?: string | null
}

export type AccountResponseDto =
  | CustomerAccountDto
  | ProphetAccountDto
  | LimitedCustomerAccountDto
