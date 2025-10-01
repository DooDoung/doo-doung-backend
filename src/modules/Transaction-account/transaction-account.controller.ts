import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common"
import {
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBody,
} from "@nestjs/swagger"
import { TransactionAccountService } from "./transaction-account.service"
import {
  TransactionAccountDto,
  CreateTransactionAccountDto,
  UpdateTransactionAccountDto,
} from "./dto/transaction-account.dto"

@ApiTags("transaction-account")
@Controller("transaction-account")
export class TransactionAccountController {
  constructor(private readonly service: TransactionAccountService) {}

  @Get("prophet/:prophetId")
  @ApiOkResponse({
    type: [TransactionAccountDto],
    description: "Get all transaction accounts for a prophet",
  })
  getByProphetId(
    @Param("prophetId") prophetId: string
  ): Promise<TransactionAccountDto[]> {
    return this.service.getTransactionAccountsByProphetId(prophetId)
  }

  @Get(":id")
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Get transaction account by ID",
  })
  getById(@Param("id") id: string): Promise<TransactionAccountDto> {
    return this.service.getTransactionAccountById(id)
  }

  @Post()
  @ApiCreatedResponse({
    type: TransactionAccountDto,
    description: "Create a new transaction account",
  })
  @ApiBody({ type: CreateTransactionAccountDto })
  create(
    @Body() body: CreateTransactionAccountDto
  ): Promise<TransactionAccountDto> {
    return this.service.createTransactionAccount(
      body.prophetId,
      body.accountName,
      body.accountNumber,
      body.bank
    )
  }

  @Patch(":id")
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Update transaction account",
  })
  @ApiBody({ type: UpdateTransactionAccountDto })
  update(
    @Param("id") id: string,
    @Body() body: UpdateTransactionAccountDto
  ): Promise<TransactionAccountDto> {
    return this.service.updateTransactionAccount(id, body)
  }

  @Delete(":id")
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Delete transaction account",
  })
  delete(@Param("id") id: string): Promise<TransactionAccountDto> {
    return this.service.deleteTransactionAccount(id)
  }
}
