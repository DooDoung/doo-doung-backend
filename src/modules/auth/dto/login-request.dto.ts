import { IsString, MaxLength } from "class-validator"

export class LoginRequestDto {
  @IsString()
  @MaxLength(30)
  username!: string

  @IsString()
  @MaxLength(72)
  password!: string
}
