import { IsString, Length } from "class-validator"

export class CreateAccountDto {
  @IsString()
  @Length(1, 16)
  account_id!: string

  @IsString()
  @Length(1, 16)
  username!: string

  @IsString()
  @Length(1, 45)
  password!: string
}
