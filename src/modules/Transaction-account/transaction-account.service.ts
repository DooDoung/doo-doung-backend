import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { TransactionAccountRepository } from "./transaction-account.repository"
import { ProphetService } from "../prophet/prophet.service"
import { NanoidService } from "../../common/utils/nanoid"
import { TransactionAccountDto } from "./dto/transaction-account.dto"
import { Bank } from "@prisma/client"

@Injectable()
export class TransactionAccountService {
  constructor(
    private readonly repo: TransactionAccountRepository,
    private readonly prophetService: ProphetService,
    private readonly nanoidService: NanoidService
  ) {}

  async getTransactionAccountsByProphetId(
    prophetId: string
  ): Promise<TransactionAccountDto[]> {
    const accountId = prophetId
    const prophet = await this.prophetService.getDetailByAccountId(
      accountId,
      false
    )
    if (!prophet) {
      throw new NotFoundException("Prophet not found")
    }

    return await this.repo.findByProphetId(prophetId)
  }

  async createTransactionAccount(
    prophetId: string,
    accountName: string,
    accountNumber: string,
    bank: Bank
  ): Promise<TransactionAccountDto> {
    const accountId = prophetId
    const prophet = await this.prophetService.getDetailByAccountId(
      accountId,
      false
    )
    if (!prophet) {
      throw new NotFoundException("Prophet not found")
    }

    const id = await this.nanoidService.generateId()

    const transactionAccountData = {
      id,
      prophetId,
      accountName,
      accountNumber,
      bank,
      isDefault: false,
    }

    return await this.repo.createTransactionAccount(transactionAccountData)
  }

  async updateTransactionAccount(
    id: string,
    updateData: { accountName?: string; accountNumber?: string; bank?: Bank }
  ): Promise<TransactionAccountDto> {
    const existingAccount = await this.repo.findById(id)
    if (!existingAccount) {
      throw new NotFoundException("Transaction account not found")
    }

    return await this.repo.updateTransactionAccount(id, updateData)
  }

  async makeDefaultTransactionAccount(
    prophetId: string,
    newDefaultTransactionAccountId: string
  ): Promise<TransactionAccountDto> {
    // Verify prophet exists
    const accountId = prophetId
    const prophet = await this.prophetService.getDetailByAccountId(
      accountId,
      false
    )
    if (!prophet) {
      throw new NotFoundException("Prophet not found")
    }

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

    return await this.repo.deleteTransactionAccount(id)
  }

  async getTransactionAccountById(id: string): Promise<TransactionAccountDto> {
    const account = await this.repo.findById(id)
    if (!account) {
      throw new NotFoundException("Transaction account not found")
    }

    return account
  }
}
