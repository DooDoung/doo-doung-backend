import { Controller, Get, Param } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { TransactionAccountService } from "./transaction-account.service"
import {
  TransactionAccountDto,
  TransactionsAccountResponseDto,
} from "./dto/transaction-account.dto"

@ApiTags("transactionaccount")
@Controller("transactionaccount")
export class TransactionAccountController {
  constructor(private readonly service: TransactionAccountService) {}

  @Get()
  @ApiOkResponse({
    type: TransactionsAccountResponseDto,
  })
  getAll(): Promise<TransactionsAccountResponseDto> {
    return this.service.getAllTransactions()
  }

  @Get(":id")
  @ApiOkResponse({
    type: TransactionsAccountResponseDto,
  })
  getById(@Param("id") id: string): Promise<TransactionAccountDto> {
    return this.service.getTransactionById(id)
  }

  @Get("me")
  @ApiOkResponse({
    type: TransactionsAccountResponseDto,
  })
  get(): Promise<TransactionsAccountResponseDto> {
    const tmpcustomerId = "3ad80e2e4bdc4b7a"
    return this.service.getTransactionByAccountId(tmpcustomerId)
  }

  @Get("account/:id")
  @ApiOkResponse({
    type: TransactionsAccountResponseDto,
  })
  getByAccountId(
    @Param("id") id: string
  ): Promise<TransactionsAccountResponseDto> {
    return this.service.getTransactionByAccountId(id)
  }

  @Get("customer/:id")
  @ApiOkResponse({
    type: TransactionsAccountResponseDto,
  })
  getByCustomerId(
    @Param("id") id: string
  ): Promise<TransactionsAccountResponseDto> {
    return this.service.getTransactionByCustomerId(id)
  }

  @Get("admin/:id")
  @ApiOkResponse({
    type: TransactionsAccountResponseDto,
  })
  getByAdminId(
    @Param("id") id: string
  ): Promise<TransactionsAccountResponseDto> {
    return this.service.getTransactionByAccountId(id)
  }
}
