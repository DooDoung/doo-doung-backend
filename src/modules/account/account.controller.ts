import { Controller, Get, Param } from "@nestjs/common"
import { AccountService } from "./account.service"
import { AccountResponseDto } from "./dto/get-account.dto"

@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  get(): Promise<AccountResponseDto> {
    return this.service.getMyAccount()
  }

  @Get(":id")
  getById(@Param("id") id: string): Promise<AccountResponseDto> {
    return this.service.getAccountById(id)
  }
}
