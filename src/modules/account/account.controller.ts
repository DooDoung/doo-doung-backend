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
  ApiBody,
} from "@nestjs/swagger"
import {
  BaseRegisterDto,
  CustomerRegisterDto,
  ProphetRegisterDto,
  ProphetTxAccountDto,
} from "./dto/register-request.dto"

@ApiTags("account")
@ApiExtraModels(
  BaseRegisterDto,
  ProphetTxAccountDto,
  CustomerRegisterDto,
  ProphetRegisterDto,
  ProphetAccountDto,
  CustomerAccountDto
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
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CustomerRegisterDto) },
        { $ref: getSchemaPath(ProphetRegisterDto) },
      ],
      discriminator: { propertyName: "role" },
    },
  })
  async post(
    @Body() body: CustomerRegisterDto | ProphetRegisterDto
  ): Promise<AccountResponseDto> {
    const role = body.role
    return await this.service.createAccount(role, body)
  }
}
