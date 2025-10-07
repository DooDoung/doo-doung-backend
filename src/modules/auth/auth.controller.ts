import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginResponseDto } from "./dto/login-result.dto"
import { LoginRequestDto } from "./dto/login-request.dto"
import { HttpCode, HttpStatus } from "@nestjs/common"
import {
  RequestResetPasswordDto,
  ConfirmResetPasswordDto,
} from "./dto/reset-password.dto"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { Public } from "@/common/decorators/public.decorator"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBearerAuth()
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.auth.login(body.username, body.password)
  }

  @Public()
  @Post("reset-password/request")
  @HttpCode(HttpStatus.OK)
  async requestResetPassword(
    @Body() body: RequestResetPasswordDto
  ): Promise<void> {
    await this.auth.requestResetPassword(body.email)
  }
  @Public()
  @Post("reset-password/confirm")
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() body: ConfirmResetPasswordDto
  ): Promise<void> {
    await this.auth.confirmResetPassword(body.token, body.newPassword)
  }
}
