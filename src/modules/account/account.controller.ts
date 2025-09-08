import { Controller, Get ,Post, Body} from "@nestjs/common"
import { Role } from "@prisma/client"
import { AccountService } from "./account.service"

@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  get() {
    return this.service.getMyAccount()
  }
  @Post("register")
  async post(@Body() body: any) {
    console.log("body", body);
    try {
      const role = body.role;  // now works
      return await this.service.createAccount(role, body);
    } catch (e) {
      console.error(2);
      throw e;
    }
  }

}
