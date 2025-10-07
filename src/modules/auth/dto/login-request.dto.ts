import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength } from "class-validator"

export class LoginRequestDto {
  @ApiProperty({"example" : "john_doe"})
  @IsString()
  @MaxLength(30)
  username!: string

  @ApiProperty({"example":"securepassword123"})
  @IsString()
  @MaxLength(72)
  password!: string
}
