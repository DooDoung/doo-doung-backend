import { Injectable, NotFoundException } from "@nestjs/common"
import { AccountRepository } from "./account.repository"
import { Role } from "@prisma/client"
import { CustomerService } from "../customer/customer.service"
import { ProphetService } from "../prophet/prophet.service"
import { Account } from "src/common/types/account.types"

@Injectable()
export class AccountService {
  constructor(
    private readonly repo: AccountRepository,
    private readonly customerService: CustomerService,
    private readonly prophetService: ProphetService
  ) {}

  async getMyAccount() {
    const tmpAccountId = "01f580f4e5ab4d0f"
    const account = await this.repo.findBaseById(tmpAccountId, {
      username: true,
      email: true,
      role: true,
      userDetail: {
        select: { phoneNumber: true, gender: true, profileUrl: true },
      },
    })
    if (!account) throw new NotFoundException("Account not found")

    const base = {
      username: account.username,
      email: account.email,
      phoneNumber: account.userDetail?.phoneNumber,
      gender: account.userDetail?.gender,
      profileUrl: account.userDetail?.profileUrl ?? null,
    }

    if (account.role === Role.CUSTOMER) {
      const { isPublic, ...customer } =
        await this.customerService.getDetailByAccountId(tmpAccountId)

      return { ...base, role: Role.CUSTOMER, ...customer }
    }

    if (account.role === Role.PROPHET) {
      const prophet = await this.prophetService.getDetailByAccountId(
        tmpAccountId,
        true
      )
      return { ...base, role: Role.PROPHET, ...prophet }
    }

    throw new NotFoundException("Role not found")
  }

  async getAccountById(accountId: string) {
    const account = await this.repo.findBaseById(accountId, {
      username: true,
      email: true,
      role: true,
      userDetail: {
        select: { phoneNumber: true, gender: true, profileUrl: true },
      },
    })
    if (!account) throw new NotFoundException("Account not found")
    const base = {
      username: account.username,
      email: account.email,
      phoneNumber: account.userDetail?.phoneNumber,
      gender: account.userDetail?.gender,
      profileUrl: account.userDetail?.profileUrl ?? null,
    }
    if (account.role === Role.CUSTOMER) {
      const { isPublic, ...customer } =
        await this.customerService.getDetailByAccountId(accountId)
      if (isPublic) {
        return { ...base, role: Role.CUSTOMER, ...customer }
      } else {
        return { username: base.username, profileUrl: base.profileUrl }
      }
    }
    if (account.role === Role.PROPHET) {
      const prophet = await this.prophetService.getDetailByAccountId(
        accountId,
        false
      )
      return { ...base, role: Role.PROPHET, ...prophet }
    }
    throw new NotFoundException("Role not found")
  }

  async getAccountByUsername(username: string): Promise<Account> {
    const account = await this.repo.findAccountByUsername(username, {
      id: true,
      username: true,
      email: true,
      role: true,
      passwordHash: true,
    })
    if (!account) throw new NotFoundException("Account not found")

    return account
  }

  async findAccountByEmail(email: string): Promise<Account> {
    const account = await this.repo.findAccountByEmail(email)
    if (!account) throw new NotFoundException("Account not found")
    return account
  }

  async updatePassword(
    accountId: string,
    hashedPassword: string
  ): Promise<void> {
    const account = await this.repo.updatePassword(accountId, hashedPassword)
    if (!account) throw new NotFoundException("Account not found")
  }
}
