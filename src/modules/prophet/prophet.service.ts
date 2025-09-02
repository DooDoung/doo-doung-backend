// prophet.service.ts
import { Injectable } from "@nestjs/common"
import { ProphetRepository } from "./prophet.repository"
import type { TxAccount } from "../account/interface/get-account.interface"
import type { Prisma } from "@prisma/client"

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
      lineId: prophet?.lineId ?? null,
      ...(includeTxAccounts ? { txAccounts } : { txAccounts: [] }),
    }
  }
}
