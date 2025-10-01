import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { TransactionAccountDto } from "./dto/transaction-account.dto"

@Injectable()
export class TransactionAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProphetId(prophetId: string): Promise<TransactionAccountDto[]> {
    return this.prisma.transactionAccount.findMany({
      where: {
        prophetId: prophetId,
      },
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
      },
    }) as Promise<TransactionAccountDto[]>
  }

  // Note: If you need to mark a transaction account as default,
  // you should add a 'isDefault' boolean field to the TransactionAccount model
  // and update that field instead of trying to modify the Prophet model

  // makeDefaultTransactionAccount(id: string): Promise<TransactionAccountDto> {
  //   return this.prisma.transactionAccount.update({
  //     where: { id },

  //   }) as Promise<TransactionAccountDto>
  // }

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
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
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
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
      },
    }) as Promise<TransactionAccountDto>
  }

  deleteTransactionAccount(id: string): Promise<TransactionAccountDto> {
    return this.prisma.transactionAccount.delete({
      where: { id },
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
      },
    }) as Promise<TransactionAccountDto>
  }

  findById(id: string): Promise<TransactionAccountDto | null> {
    return this.prisma.transactionAccount.findUnique({
      where: { id },
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
      },
    }) as Promise<TransactionAccountDto | null>
  }
}
