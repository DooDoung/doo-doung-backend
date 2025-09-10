import { Controller, Get, Param, Post, Body } from "@nestjs/common"
import { Role } from "@prisma/client"
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
  @Post("register")
  async post(@Body() body: any) {
    console.log("body", body)
    try {
      const role = body.role // now works
      return await this.service.createAccount(role, body)
    } catch (e) {
      console.error(2)
      throw e
    }
  }
}
