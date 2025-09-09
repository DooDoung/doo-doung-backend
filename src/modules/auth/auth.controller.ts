import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { HttpCode, HttpStatus } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { LoginResponseDto } from "./dto/login-result.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.auth.login(body.username, body.password)
  }
}
