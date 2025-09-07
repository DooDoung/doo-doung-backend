import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength } from "class-validator"

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  username!: string

  @ApiProperty()
  @IsString()
  @MaxLength(72)
  password!: string
}
