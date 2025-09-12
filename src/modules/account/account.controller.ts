import { Controller, Get, Param, Post, Body } from "@nestjs/common"
import { AccountService } from "./account.service"
import {
  AccountResponseDto,
  CustomerAccountDto,
  ProphetAccountDto,
  LimitedCustomerAccountDto,
} from "./dto/get-account.dto"
import {
  ApiOkResponse,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
} from "@nestjs/swagger"

@ApiTags("account")
@ApiExtraModels(
  CustomerAccountDto,
  ProphetAccountDto,
  LimitedCustomerAccountDto
)
@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CustomerAccountDto) },
        { $ref: getSchemaPath(ProphetAccountDto) },
        { $ref: getSchemaPath(LimitedCustomerAccountDto) },
      ],
    },
  })
  get(): Promise<AccountResponseDto> {
    return this.service.getMyAccount()
  }

  @Get(":id")
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CustomerAccountDto) },
        { $ref: getSchemaPath(ProphetAccountDto) },
        { $ref: getSchemaPath(LimitedCustomerAccountDto) },
      ],
    },
  })
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
      console.error(e)
      throw e
    }
  }
}
