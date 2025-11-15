import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { TransactionAccountDto } from "./dto/response-tx-account.dto"

@Injectable()
export class TransactionAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProphetIdByAccountId(
    accountId: string
  ): Promise<{ id: string } | null> {
    return this.prisma.prophet.findUnique({
      where: { accountId },
      select: { id: true },
    })
  }

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

  async makeDefaultTransactionAccount(
    prophetId: string,
    id: string
  ): Promise<TransactionAccountDto> {
    try {
      return (await this.prisma.transactionAccount.update({
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
      })) as TransactionAccountDto
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new BadRequestException("Transaction account not found")
      }
      throw error
    }
  }

  async removeDefaultTransactionAccount(
    prophetId: string,
    id: string
  ): Promise<TransactionAccountDto> {
    try {
      return (await this.prisma.transactionAccount.update({
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
      })) as TransactionAccountDto
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new BadRequestException("Transaction account not found")
      }
      throw error
    }
  }

  async createTransactionAccount(
    transactionAccountData: Omit<TransactionAccountDto, "id"> & { id: string }
  ): Promise<TransactionAccountDto> {
    try {
      return (await this.prisma.transactionAccount.create({
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
      })) as TransactionAccountDto
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(
          "A transaction account with this bank and account number already exists for this prophet"
        )
      }
      throw error
    }
  }

  async updateTransactionAccount(
    id: string,
    updateData: Partial<Omit<TransactionAccountDto, "id" | "prophetId">>
  ): Promise<TransactionAccountDto> {
    try {
      return (await this.prisma.transactionAccount.update({
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
      })) as TransactionAccountDto
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new BadRequestException(
            "A transaction account with this bank and account number already exists for this prophet"
          )
        }
        if (error.code === "P2025") {
          throw new BadRequestException("Transaction account not found")
        }
      }
      throw error
    }
  }

  async deleteTransactionAccount(id: string): Promise<TransactionAccountDto> {
    try {
      return (await this.prisma.transactionAccount.delete({
        where: { id },
        select: {
          id: true,
          prophetId: true,
          accountName: true,
          accountNumber: true,
          bank: true,
          isDefault: true,
        },
      })) as TransactionAccountDto
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new BadRequestException("Transaction account not found")
      }
      throw error
    }
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
