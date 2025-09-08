import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthDTO } from "./dto"

@Controller()
export class AuthController {
  constructor(private service: AuthService) {}

  @Post("login")
  login() {
    return this.service.login()
  }
  @Post("signup")
  signup(@Body() dto: AuthDTO) {
    return this.service.signup()
  }
}
