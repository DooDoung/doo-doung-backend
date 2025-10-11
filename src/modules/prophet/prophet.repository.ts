import { Injectable } from "@nestjs/common"
import { Bank, Prisma } from "@prisma/client"
import { PrismaService } from "../../db/prisma.service"
import { NanoidService } from "../../common/utils/nanoid"

@Injectable()
export class ProphetRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nanoid: NanoidService
  ) {}

  async findByAccountId<S extends Prisma.ProphetSelect>(
    accountId: string,
    select: S
  ): Promise<Prisma.ProphetGetPayload<{ select: S }> | null> {
    return this.prisma.prophet.findUnique({
      where: { accountId },
      select,
    })
  }
  async createProphet(
    accountId: string,
    lineId: string,
    txAccounts?: {
      bank: Bank
      accountName: string
      accountNumber: string
    }[]
  ) {
    const id = await this.nanoid.generateId()
    const prophet = await this.prisma.prophet.create({
      data: {
        id: id,
        accountId: accountId,
        lineId: lineId,
      } as Prisma.ProphetUncheckedCreateInput,
    })
    const txAccountReturns = []
    if (txAccounts?.length) {
      for (const txAccount of txAccounts) {
        const t_id = await this.nanoid.generateId()
        const createdTxAccount = await this.prisma.transactionAccount.create({
          data: {
            id: t_id,
            prophetId: id,
            bank: txAccount.bank,
            accountName: txAccount.accountName,
            accountNumber: txAccount.accountNumber,
          } as Prisma.TransactionAccountUncheckedCreateInput,
        })
        txAccountReturns.push(createdTxAccount)
      }
    }
    return { ...prophet, txAccount: txAccountReturns }
  }
  async updateProphetDetail(accountId: string, lineId: string) {
    const updatedProphetDetail = await this.prisma.prophet.update({
      where: { accountId: accountId },
      data: {
        lineId: lineId,
      } as Prisma.ProphetUncheckedUpdateInput,
    })
    const currentTxAccounts = await this.prisma.transactionAccount.findMany({
      where: { prophetId: updatedProphetDetail.id },
    })
    return { ...updatedProphetDetail, txAccount: currentTxAccounts }
  }
}
