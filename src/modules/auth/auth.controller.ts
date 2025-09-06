// auth.controller.ts
import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginResult } from "./interface/login-result.interface"
import { LoginDto } from "./dto/login.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() body: LoginDto): Promise<LoginResult> {
    return this.auth.login(body.username, body.password)
  }
}
