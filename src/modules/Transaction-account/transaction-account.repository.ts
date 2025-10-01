import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { TransactionAccountDto } from "./dto/transaction-account.dto"
import { ProphetAccountDto } from "../account/dto/get-account.dto"

@Injectable()
export class TransactionAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProphetId(prophetId: string): Promise<TransactionAccountDto[]> {
    return this.prisma.transactionAccount.findMany({
      where: {
        prophetId: prophetId,
      },
    }) as Promise<TransactionAccountDto[]>
  }

  makeTransactionAccountDefaultForProphetId(
    prophetId: string,
    transactionAccountId: string
  ): Promise<ProphetAccountDto> {
    return this.prisma.prophet.update({
      where: { id: prophetId },
      data: {
        DefaulttxAccountsId: transactionAccountId,
      },
    }) as Promise<ProphetAccountDto>
  }

  createTransactionAccount(
    transactionAccountData: Omit<TransactionAccountDto, "id"> & { id: string }
  ): Promise<TransactionAccountDto> {
    return this.prisma.transactionAccount.create({
      data: {
        id: transactionAccountData.id,
        prophetId: transactionAccountData.prophetId,
        accountName: transactionAccountData.accountName,
        accountNumber: transactionAccountData.accountNumber,
        bank: transactionAccountData.bank,
      },
    }) as Promise<TransactionAccountDto>
  }

  updateTransactionAccount(
    id: string,
    updateData: Partial<Omit<TransactionAccountDto, "id" | "prophetId">>
  ): Promise<TransactionAccountDto> {
    return this.prisma.transactionAccount.update({
      where: { id },
      data: updateData,
    }) as Promise<TransactionAccountDto>
  }

  deleteTransactionAccount(id: string): Promise<TransactionAccountDto> {
    return this.prisma.transactionAccount.delete({
      where: { id },
    }) as Promise<TransactionAccountDto>
  }

  findById(id: string): Promise<TransactionAccountDto | null> {
    return this.prisma.transactionAccount.findUnique({
      where: { id },
    }) as Promise<TransactionAccountDto | null>
  }
}
