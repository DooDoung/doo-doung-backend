import { Injectable, NotFoundException } from "@nestjs/common"
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
    const prophet = await this.prophetService.getDetailByAccountId(
      prophetId,
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
    const prophet = await this.prophetService.getDetailByAccountId(
      prophetId,
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

  async deleteTransactionAccount(id: string): Promise<TransactionAccountDto> {
    const existingAccount = await this.repo.findById(id)
    if (!existingAccount) {
      throw new NotFoundException("Transaction account not found")
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
