import { Injectable } from "@nestjs/common"
import { ProphetRepository } from "./prophet.repository"
import { Bank, Prisma } from "@prisma/client"
import type { TxAccount } from "src/common/types/tx-account.type"

type includeTxAccounts = boolean

@Injectable()
export class ProphetService {
  constructor(private readonly repo: ProphetRepository) {}

  async getDetailByAccountId(
    accountId: string,
    includeTxAccounts: includeTxAccounts
  ) {
    const select: Prisma.ProphetSelect = {
      lineId: true,
      ...(includeTxAccounts && {
        txAccounts: {
          select: { bank: true, accountName: true, accountNumber: true },
        },
      }),
    }

    const prophet = await this.repo.findByAccountId(accountId, select)

    const txAccounts: TxAccount[] =
      (prophet as any)?.txAccounts?.map((acc: any) => ({
        bank: acc.bank,
        accountName: acc.accountName,
        accountNumber: acc.accountNumber,
      })) ?? []

    return {
      lineId: prophet?.lineId,
      ...(includeTxAccounts ? { txAccounts } : { txAccounts: [] }),
    }
  }
  async createProphetDetail(
    accountId: string,
    dto: {
      lineId: string
      txAccounts?: { bank: Bank; accountName: string; accountNumber: string }[]
    }
  ) {
    return await this.repo.createProphet(accountId, dto.lineId, dto.txAccounts)
  }
}
