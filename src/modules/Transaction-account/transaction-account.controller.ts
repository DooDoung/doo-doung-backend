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
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { TransactionAccountService } from "./transaction-account.service"
import {
  TransactionAccountDto,
  CreateTransactionAccountDto,
  UpdateTransactionAccountDto,
} from "./dto/transaction-account.dto"

/**
 * Transaction Account API Controller
 *
 * Manages payment accounts for prophets in the DooDoung platform.
 * Each prophet can have multiple transaction accounts from different banks,
 * but only one can be set as the default payment method.
 *
 * Supported Thai Banks:
 * - BBL (Bangkok Bank)
 * - KTB (Krungthai Bank)
 * - KBANK (Kasikorn Bank)
 * - SCB (Siam Commercial Bank)
 * - BAY (Krungsri)
 * - TTB (TMBThanachart)
 * - CIMB (CIMB Thai)
 * - UOB (UOB Thai)
 * - GSB (Government Savings Bank)
 * - BAAC (Bank for Agriculture)
 *
 * @author DooDoung Development Team
 * @version 1.0.0
 */

@ApiTags("transaction-account")
@Controller("transaction-account")
@ApiBearerAuth()
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
          id: "txa_baaff717",
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
  @ApiNotFoundResponse({
    description: "Prophet not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Prophet not found",
        error: "Not Found",
      },
    },
  })
  getByProphetId(
    @Param("prophetId") prophetId: string
  ): Promise<TransactionAccountDto[]> {
    return this.service.getTransactionAccountsByProphetId(prophetId)
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get transaction account by ID",
    description:
      "Retrieves a specific transaction account by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "The transaction account ID",
    example: "txa_baaff717",
  })
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Transaction account details",
    schema: {
      example: {
        id: "txa_baaff717",
        prophetId: "dev_prophet_001",
        accountName: "Main Business Account",
        accountNumber: "1234567890",
        bank: "KBANK",
        isDefault: true,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Transaction account not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Transaction account not found",
        error: "Not Found",
      },
    },
  })
  getById(@Param("id") id: string): Promise<TransactionAccountDto> {
    return this.service.getTransactionAccountById(id)
  }

  @Post()
  @ApiOperation({
    summary: "Create a new transaction account",
    description:
      "Creates a new payment account for a prophet. The account will be set as non-default initially.",
  })
  @ApiCreatedResponse({
    type: TransactionAccountDto,
    description: "Successfully created transaction account",
    schema: {
      example: {
        id: "tx_acc_new123456",
        prophetId: "dev_prophet_001",
        accountName: "New Business Account",
        accountNumber: "9876543210",
        bank: "SCB",
        isDefault: false,
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or validation failed",
    schema: {
      example: {
        statusCode: 400,
        message: [
          "prophetId length should be 16",
          "accountName length should be max 45 characters",
          "bank must be a valid enum value",
        ],
        error: "Bad Request",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Prophet not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Prophet not found",
        error: "Not Found",
      },
    },
  })
  @ApiConflictResponse({
    description: "Account number already exists for this bank",
    schema: {
      example: {
        statusCode: 409,
        message:
          "Transaction account with this account number and bank already exists",
        error: "Conflict",
      },
    },
  })
  @ApiBody({
    type: CreateTransactionAccountDto,
    description: "Transaction account creation details",
    examples: {
      kbank: {
        summary: "Kasikorn Bank Account",
        description: "Example of creating a Kasikorn Bank account",
        value: {
          prophetId: "dev_prophet_001",
          accountName: "Main Business Account",
          accountNumber: "1234567890",
          bank: "KBANK",
        },
      },
      scb: {
        summary: "Siam Commercial Bank Account",
        description: "Example of creating an SCB account",
        value: {
          prophetId: "dev_prophet_001",
          accountName: "Secondary Account",
          accountNumber: "0987654321",
          bank: "SCB",
        },
      },
    },
  })
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
  @ApiOperation({
    summary: "Update transaction account",
    description:
      "Updates the details of an existing transaction account. Prophet ID cannot be changed.",
  })
  @ApiParam({
    name: "id",
    description: "The transaction account ID to update",
    example: "txa_baaff717",
  })
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Successfully updated transaction account",
    schema: {
      example: {
        id: "txa_baaff717",
        prophetId: "dev_prophet_001",
        accountName: "Updated Account Name",
        accountNumber: "1234567890",
        bank: "BBL",
        isDefault: true,
      },
    },
  })
  @ApiBody({
    type: UpdateTransactionAccountDto,
    description: "Fields to update in the transaction account",
    examples: {
      updateName: {
        summary: "Update Account Name",
        description: "Example of updating only the account name",
        value: {
          accountName: "Updated Business Account",
        },
      },
      updateBank: {
        summary: "Update Bank",
        description: "Example of changing the bank",
        value: {
          bank: "BBL",
        },
      },
      updateAll: {
        summary: "Update Multiple Fields",
        description: "Example of updating multiple fields at once",
        value: {
          accountName: "New Account Name",
          accountNumber: "5555555555",
          bank: "KTB",
        },
      },
    },
  })
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
    example: "txa_baaff717",
  })
  @ApiOkResponse({
    type: TransactionAccountDto,
    description: "Successfully set transaction account as default",
    schema: {
      example: {
        id: "txa_baaff717",
        prophetId: "dev_prophet_001",
        accountName: "Prophet Banking Account",
        accountNumber: "1234567890",
        bank: "KBANK",
        isDefault: true,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Prophet or transaction account not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Transaction account not found",
        error: "Not Found",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Transaction account does not belong to the prophet",
    schema: {
      example: {
        statusCode: 404,
        message: "Transaction account does not belong to this prophet",
        error: "Not Found",
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
  @ApiOperation({
    summary: "Delete transaction account",
    description:
      "Permanently deletes a transaction account. Warning: This action cannot be undone. If this was the default account, you'll need to set another account as default. Cannot delete the last remaining transaction account for a prophet.",
  })
  @ApiParam({
    name: "id",
    description: "The transaction account ID to delete",
    example: "txa_baaff717",
  })
  @ApiOkResponse({
    type: TransactionAccountDto,
    description:
      "Successfully deleted transaction account (returns the deleted account data)",
    schema: {
      example: {
        id: "txa_baaff717",
        prophetId: "dev_prophet_001",
        accountName: "Deleted Account",
        accountNumber: "1234567890",
        bank: "KBANK",
        isDefault: false,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Transaction account not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Transaction account not found",
        error: "Not Found",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Cannot delete the last transaction account for a prophet",
    schema: {
      example: {
        statusCode: 400,
        message:
          "Cannot delete the last transaction account. Prophet must have at least one transaction account.",
        error: "Bad Request",
      },
    },
  })
  delete(@Param("id") id: string): Promise<TransactionAccountDto> {
    return this.service.deleteTransactionAccount(id)
  }
}
