// auth.controller.ts
import { Body, Controller, Post, UseInterceptors } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginResult } from "./interface/login-result.interface"
import { TransformInterceptor } from "src/common/interceptors/transform.interceptor"
import { LoginDto } from "./dto/login.dto"

@UseInterceptors(TransformInterceptor) // TO DO: use in local first, move to global later
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() body: LoginDto): Promise<LoginResult> {
    return this.auth.login(body.username, body.password)
  }
}
