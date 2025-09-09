import { Injectable } from "@nestjs/common"
import { ProphetRepository } from "./prophet.repository"
import { Bank, Prisma } from "@prisma/client"
import { TxAccount } from "../account/interface/get-account.interface"

@Injectable()
export class ProphetService {
  constructor(private readonly repo: ProphetRepository) {}

  async getDetailByAccountId(accountId: string) {
    const prophet = await this.repo.findByAccountId(accountId, {
      lineId: true,
      txAccounts: {
        select: {
          bank: true,
          accountName: true,
          accountNumber: true,
        },
      },
    })

    const txAccounts: TxAccount[] =
      prophet?.txAccounts?.map(acc => ({
        bank: acc.bank,
        accountName: acc.accountName,
        accountNumber: acc.accountNumber,
      })) ?? []

    return {
      lineId: prophet?.lineId ?? null,
      txAccounts,
    }
  }
  async createProphetDetail(accountId: string, dto: { lineId: string; txAccounts ?: { bank: Bank, accountName: string, accountNumber: string }[] }) {
    return await this.repo.createProphet(accountId, dto.lineId, dto.txAccounts);
  }
}
