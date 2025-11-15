import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { TransactionAccountRepository } from "./tx-account.repository"
import { ProphetService } from "./prophet.service"
import { NanoidService } from "../../common/utils/nanoid"
import { TransactionAccountDto } from "./dto/response-tx-account.dto"
import { Bank } from "@prisma/client"

@Injectable()
export class TransactionAccountService {
  constructor(
    private readonly repo: TransactionAccountRepository,
    private readonly prophetService: ProphetService,
    private readonly nanoidService: NanoidService
  ) {}

  async getTransactionAccountsByAccountId(
    accountId: string
  ): Promise<TransactionAccountDto[]> {
    // Get the prophet's internal ID from the account ID
    const prophetWithId = await this.repo.findProphetIdByAccountId(accountId)
    if (!prophetWithId) {
      throw new NotFoundException("Prophet not found")
    }

    return await this.repo.findByProphetId(prophetWithId.id)
  }

  async createTransactionAccount(
    accountId: string,
    accountName: string,
    accountNumber: string,
    bank: Bank
  ): Promise<TransactionAccountDto> {
    // Get the prophet's internal ID from the account ID
    const prophetWithId = await this.repo.findProphetIdByAccountId(accountId)
    if (!prophetWithId) {
      throw new NotFoundException("Prophet not found")
    }

    const id = await this.nanoidService.generateId()

    const transactionAccountData = {
      id,
      prophetId: prophetWithId.id,
      accountName,
      accountNumber,
      bank,
      isDefault: false,
    }

    try {
      return await this.repo.createTransactionAccount(transactionAccountData)
    } catch (error) {
      // The repository already handles BadRequestException, so just re-throw
      if (error instanceof BadRequestException) {
        throw error
      }
      // For any other unexpected errors, wrap them in a generic bad request
      throw new BadRequestException("Failed to create transaction account")
    }
  }

  async updateTransactionAccount(
    id: string,
    updateData: { accountName?: string; accountNumber?: string; bank?: Bank }
  ): Promise<TransactionAccountDto> {
    const existingAccount = await this.repo.findById(id)
    if (!existingAccount) {
      throw new NotFoundException("Transaction account not found")
    }

    try {
      return await this.repo.updateTransactionAccount(id, updateData)
    } catch (error) {
      // The repository already handles BadRequestException, so just re-throw
      if (error instanceof BadRequestException) {
        throw error
      }
      // For any other unexpected errors, wrap them in a generic bad request
      throw new BadRequestException("Failed to update transaction account")
    }
  }

  async makeDefaultTransactionAccount(
    accountId: string,
    newDefaultTransactionAccountId: string
  ): Promise<TransactionAccountDto> {
    // Get the prophet's internal ID from the account ID
    const prophetWithId = await this.repo.findProphetIdByAccountId(accountId)
    if (!prophetWithId) {
      throw new NotFoundException("Prophet not found")
    }

    const prophetId = prophetWithId.id

    // Verify the transaction account exists and belongs to this prophet
    const targetAccount = await this.repo.findById(
      newDefaultTransactionAccountId
    )
    if (!targetAccount) {
      throw new NotFoundException("Transaction account not found")
    }

    if (targetAccount.prophetId !== prophetId) {
      throw new NotFoundException(
        "Transaction account does not belong to this prophet"
      )
    }

    try {
      // First, remove default status from all existing accounts for this prophet
      const existingAccounts = await this.repo.findByProphetId(prophetId)
      for (const account of existingAccounts) {
        if (account.id !== newDefaultTransactionAccountId) {
          await this.repo.removeDefaultTransactionAccount(prophetId, account.id)
        }
      }

      // Set the new default account
      return await this.repo.makeDefaultTransactionAccount(
        prophetId,
        newDefaultTransactionAccountId
      )
    } catch (error) {
      // The repository already handles BadRequestException, so just re-throw
      if (error instanceof BadRequestException) {
        throw error
      }
      // For any other unexpected errors, wrap them in a generic bad request
      throw new BadRequestException("Failed to set default transaction account")
    }
  }

  async deleteTransactionAccount(id: string): Promise<TransactionAccountDto> {
    const existingAccount = await this.repo.findById(id)
    if (!existingAccount) {
      throw new NotFoundException("Transaction account not found")
    }

    // Check if this is the last transaction account for this prophet
    const allAccountsForProphet = await this.repo.findByProphetId(
      existingAccount.prophetId
    )
    if (allAccountsForProphet.length === 1) {
      throw new BadRequestException(
        "Cannot delete the last transaction account. Prophet must have at least one transaction account."
      )
    }

    try {
      return await this.repo.deleteTransactionAccount(id)
    } catch (error) {
      // The repository already handles BadRequestException, so just re-throw
      if (error instanceof BadRequestException) {
        throw error
      }
      // For any other unexpected errors, wrap them in a generic bad request
      throw new BadRequestException("Failed to delete transaction account")
    }
  }

  async getTransactionAccountById(id: string): Promise<TransactionAccountDto> {
    const account = await this.repo.findById(id)
    if (!account) {
      throw new NotFoundException("Transaction account not found")
    }

    return account
  }
}
