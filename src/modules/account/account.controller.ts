import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common"
import { AccountService } from "./account.service"
import { AccountResponseDto } from "./dto/get-account.dto"
import { AccountDto } from "./interface/create-account.interface"

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
  async post(@Body() body: any): Promise<AccountDto> {
    console.log("body", body)
    try {
      const role = body.role // now works
      return await this.service.createAccount(role, body)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
  @Put()
  async put(@Body() body: any): Promise<AccountDto> {
    try {
      console.log(body)
      const role = body.role // now works
      return await this.service.updateAccount(role, body)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
