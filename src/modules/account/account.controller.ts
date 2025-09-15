import { Controller, Get, Param, Post, Body, UseGuards } from "@nestjs/common"
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
import { Public } from "@/common/decorators/public.decorator"
import { CurrentUser } from "@/common/decorators/current-user.decorator"

@ApiTags("account")
@ApiExtraModels(
  BaseRegisterDto,
  ProphetTxAccountDto,
  CustomerRegisterDto,
  ProphetRegisterDto,
  ProphetAccountDto,
  CustomerAccountDto,
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
  get(@CurrentUser("id") id: string): Promise<AccountResponseDto> {
    return this.service.getMyAccount(id)
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

  @Public()
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
    try {
      const role = body.role // now works
      return await this.service.createAccount(role, body)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
