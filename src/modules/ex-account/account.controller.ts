import { Body, Controller, Post } from "@nestjs/common"
import { EXAccountService } from "./account.service"
import { EXCreateAccountDto } from "./dto/create-account.dto"

@Controller("/ex-account")
export class EXAccountController {
  constructor(private readonly service: EXAccountService) {}

  @Post()
  create(@Body() dto: EXCreateAccountDto) {
    return this.service.create(dto)
  }
}
