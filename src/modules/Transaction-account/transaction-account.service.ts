import { Injectable, NotFoundException } from "@nestjs/common"
import { TransactionAccountRepository } from "./transaction-account.repository"
import { ProphetService } from "../prophet/prophet.service"
import { AccountService } from "../account/account.service"
import {
  TransactionAccountDto,
  TransactionsAccountResponseDto,
} from "./dto/transaction-account.dto"
import { Role } from "@prisma/client"

@Injectable()
export class TransactionService {
  constructor(
    private readonly repo: TransactionAccountRepository,
    private readonly prophetService: ProphetService,
    private readonly accountService: AccountService
  ) {}

  async getTransactionAcconuntsByProphetId(
    prophetID: string
  ): Promise<TransactionAccountDto[]> {
    const prophet = await this.prophetService.getAccountByProphetId(
      prophetID,
      false
    )
    if (!prophet) {
      throw new NotFoundException("Prophet not found")
    }

    const transactionAccounts = await this.repo.findByProphetId(prophet.id)

    return transactionAccounts
  }

  async makeTransactionAcconuntDefaultForProphetId(
    prophetID: string,
    transactionAccountId: string
  ): Promise<TransactionAccountDto[]> {
    const prophet = await this.prophetService.getAccountByProphetId(
      prophetID,
      false
    )
    if (!prophet) {
      throw new NotFoundException("Prophet not found")
    }

    const transactionAccount = await this.repo.findById(transactionAccountId)
    if (!transactionAccount) {
      throw new NotFoundException("Prophet not found")
    }
    const response = await this.repo.makeTransactionAccountDefaultForProphetId(
      prophet.id,
      transactionAccount.id
    )

    return transactionAccounts
  }

  // add post transaction account
  // add patch transaction account
  // add delete transaction account & update in prophet too
}
