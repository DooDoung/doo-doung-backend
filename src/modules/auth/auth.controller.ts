// auth.controller.ts
import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginResultDTO } from "./dto/login-result.dto"
import { LoginRequestDto } from "./dto/login-request.dto"
import { HttpCode, HttpStatus } from "@nestjs/common"
import {
  RequestResetPasswordDto,
  ConfirmResetPasswordDto,
} from "./dto/reset-password.dto"
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto): Promise<LoginResultDTO> {
    return this.auth.login(body.username, body.password)
  }

  @Post("reset-password/request")
  @HttpCode(HttpStatus.OK)
  async requestResetPassword(
    @Body() body: RequestResetPasswordDto
  ): Promise<void> {
    await this.auth.requestResetPassword(body.email)
  }

  @Post("reset-password/confirm")
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() body: ConfirmResetPasswordDto
  ): Promise<void> {
    await this.auth.confirmResetPassword(body.token, body.newPassword)
  }
}
