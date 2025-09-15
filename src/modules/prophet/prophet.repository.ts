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

  findByAccountId<S extends Prisma.ProphetSelect>(
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
        /*
          id        String @id @map("id") @db.VarChar(16)
          accountId String @unique @map("account_id") @db.VarChar(16)
          lineId    String @map("line_id") @db.VarChar(20)

          txAccounts   TransactionAccount[]
        */
        id: id,
        accountId: accountId,
        lineId: lineId,
      } as Prisma.ProphetUncheckedCreateInput,
    })
    if (txAccounts?.length) {
      for (const txAccount of txAccounts) {
        const t_id = await this.nanoid.generateId()
        await this.prisma.transactionAccount.create({
          data: {
            id: t_id,
            prophetId: id,
            bank: txAccount.bank,
            accountName: txAccount.accountName,
            accountNumber: txAccount.accountNumber,
          } as Prisma.TransactionAccountUncheckedCreateInput,
        })
      }
    }
    return prophet
  }
}
