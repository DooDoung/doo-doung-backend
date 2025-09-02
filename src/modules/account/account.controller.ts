import { Controller, Get } from "@nestjs/common"
import { AccountService } from "./account.service"

@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  get() {
    return this.service.getMyAccount()
  }
}
