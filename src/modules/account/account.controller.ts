import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common"
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
  @Get("profileUrl/:username")
  getProfileUrl(@Param("username") username: string): Promise<string> {
    console.log(username)
    return this.service.getProfileUrl(username)
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
  @Put()
  async put(@Body() body: any): Promise<AccountResponseDto> {
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
