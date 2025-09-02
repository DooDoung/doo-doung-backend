import { Controller, Get, Param } from "@nestjs/common"
import { AccountService } from "./account.service"

@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  get() {
    return this.service.getMyAccount()
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.service.getAccountById(id)
  }
}
