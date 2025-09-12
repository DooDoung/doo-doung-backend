// prophet.service.ts
import { Injectable } from "@nestjs/common"
import { ProphetRepository } from "./prophet.repository"
import type { TxAccount } from "@/common/types/payment/tx-account.type"
import type { Prisma } from "@prisma/client"
import { ProphetDetail } from "./interface/prophet.interface"

type includeTxAccounts = boolean

@Injectable()
export class ProphetService {
  constructor(private readonly repo: ProphetRepository) {}

  async getDetailByAccountId(
    accountId: string,
    includeTxAccounts: includeTxAccounts
  ): Promise<ProphetDetail> {
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
}
