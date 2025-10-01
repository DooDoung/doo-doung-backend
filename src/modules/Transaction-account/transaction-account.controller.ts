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
  ApiParam,
  ApiOperation,
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
  @ApiOperation({
    summary: "Get all transaction accounts for a prophet",
    description:
      "Retrieves all payment accounts associated with a specific prophet",
  })
  @ApiParam({
    name: "prophetId",
    description: "The prophet's ID",
    example: "dev_prophet_001",
  })
  @ApiOkResponse({
    type: [TransactionAccountDto],
    description: "List of transaction accounts for the prophet",
    schema: {
      example: [
        {
          id: "tx_acc_001234567",
          prophetId: "dev_prophet_001",
          accountName: "Main Business Account",
          accountNumber: "1234567890",
          bank: "KBANK",
          isDefault: true,
        },
        {
          id: "tx_acc_987654321",
          prophetId: "dev_prophet_001",
          accountName: "Secondary Account",
          accountNumber: "0987654321",
          bank: "SCB",
          isDefault: false,
        },
      ],
    },
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

  @Patch("prophet/:prophetId/default/:transactionId")
  @ApiOperation({
    summary: "Set transaction account as default for prophet",
    description:
      "Sets the specified transaction account as the default payment method for the prophet. Only one account can be default per prophet.",
  })
  @ApiParam({
    name: "prophetId",
    description: "The prophet's ID",
    example: "dev_prophet_001",
  })
  @ApiParam({
    name: "transactionId",
    description: "The transaction account ID to set as default",
    example: "tx_acc_001234567",
  })
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Successfully set transaction account as default",
    schema: {
      example: {
        id: "tx_acc_001234567",
        prophetId: "dev_prophet_001",
        accountName: "Prophet Banking Account",
        accountNumber: "1234567890",
        bank: "KBANK",
        isDefault: true,
      },
    },
  })
  makeDefault(
    @Param("prophetId") prophetId: string,
    @Param("transactionId") transactionId: string
  ): Promise<TransactionAccountDto> {
    return this.service.makeDefaultTransactionAccount(prophetId, transactionId)
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
