import { Body, Controller, Post } from "@nestjs/common"
import { AccountService } from "./account.service"
import { CreateAccountDto } from "./dto/create-account.dto"

@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.service.create(dto)
  }
}
