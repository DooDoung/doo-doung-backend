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
  ApiBearerAuth,
} from "@nestjs/swagger"
import {
  BaseRegisterDto,
  CustomerRegisterDto,
  ProphetRegisterDto,
  ProphetTxAccountDto,
} from "./dto/register-request.dto"
import {
  CustomerUpdateAccountRequestDto,
  ProphetUpdateAccountRequestDto,
} from "./dto/update-account.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { Public } from "@/common/decorators/public.decorator"

@ApiTags("account")
@ApiExtraModels(
  BaseRegisterDto,
  ProphetTxAccountDto,
  CustomerRegisterDto,
  ProphetRegisterDto,
  ProphetAccountDto,
  CustomerAccountDto,
  LimitedCustomerAccountDto,
  CustomerUpdateAccountRequestDto,
  ProphetUpdateAccountRequestDto
)
@Controller("account")
export class AccountController {
  constructor(private readonly service: AccountService) {}
  @ApiBearerAuth()
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

  @Public()
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
  @Public()
  getById(@Param("id") id: string): Promise<AccountResponseDto> {
    return this.service.getAccountById(id)
  }
  @Get("profileUrl/:username")
  getProfileUrl(@Param("username") username: string): Promise<string> {
    return this.service.getProfileUrl(username)
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
    const role = body.role
    return await this.service.createAccount(role, body)
  }

  @ApiBearerAuth()
  @Put()
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CustomerUpdateAccountRequestDto) },
        { $ref: getSchemaPath(ProphetUpdateAccountRequestDto) },
      ],
      discriminator: { propertyName: "role" },
    },
  })
  async put(
    @CurrentUser("id") id: string,
    @Body()
    body: CustomerUpdateAccountRequestDto | ProphetUpdateAccountRequestDto
  ): Promise<AccountResponseDto> {
    return await this.service.updateAccount(id, body)
  }
}
