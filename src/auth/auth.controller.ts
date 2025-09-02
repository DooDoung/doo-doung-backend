// auth.controller.ts
import { Body, Controller, Post, UseInterceptors } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginResult } from "./interface/login-result.interface"
import { TransformInterceptor } from "../common/interceptors/transform.interceptor"

@UseInterceptors(TransformInterceptor) // use in local first, will apply to global later
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(
    @Body() body: { username: string; password: string }
  ): Promise<LoginResult> {
    return this.auth.login(body.username, body.password)
  }
}
