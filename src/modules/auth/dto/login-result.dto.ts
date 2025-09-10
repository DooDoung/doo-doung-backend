import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  username!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  role!: string
}

export class LoginResponseDto {
  @ApiProperty({ type: () => UserDto })
  user!: UserDto

  @ApiProperty()
  accessToken!: string

  @ApiProperty()
  expiresAt!: number
}
