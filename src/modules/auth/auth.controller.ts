// auth.controller.ts
import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginResult } from "./interface/login-result.interface"
import { LoginDto } from "./dto/login.dto"
import { HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<LoginResult> {
    return this.auth.login(body.username, body.password)
  }
}
