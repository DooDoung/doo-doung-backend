import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { TransactionAccountDto } from "./dto/response-tx-account.dto"

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
        isDefault: true,
      },
    }) as Promise<TransactionAccountDto[]>
  }

  makeDefaultTransactionAccount(
    prophetId: string,
    id: string
  ): Promise<TransactionAccountDto> {
    return this.prisma.transactionAccount.update({
      where: { prophetId, id },
      data: {
        isDefault: true,
      },
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
        isDefault: true,
      },
    }) as Promise<TransactionAccountDto>
  }

  removeDefaultTransactionAccount(
    prophetId: string,
    id: string
  ): Promise<TransactionAccountDto> {
    return this.prisma.transactionAccount.update({
      where: { prophetId, id },
      data: {
        isDefault: false,
      },
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
        isDefault: true,
      },
    }) as Promise<TransactionAccountDto>
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
        isDefault: false, // New accounts are not default by default
      },
      select: {
        id: true,
        prophetId: true,
        accountName: true,
        accountNumber: true,
        bank: true,
        isDefault: true,
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
        isDefault: true,
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
        isDefault: true,
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
        isDefault: true,
      },
    }) as Promise<TransactionAccountDto | null>
  }
}
