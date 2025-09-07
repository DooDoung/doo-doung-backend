import { Injectable, NotFoundException } from "@nestjs/common"
import { AccountRepository } from "./account.repository"
import { Role } from "@prisma/client"
import { MeResponse } from "./interface/get-account.interface"
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

  async getMyAccount(): Promise<MeResponse> {
    const tmpAccountId = "01f580f4e5ab4d0f"
    const account = await this.repo.findBaseById(tmpAccountId, {
      username: true,
      email: true,
      role: true,
      userDetail: { select: { phoneNumber: true, gender: true } },
    })
    if (!account) throw new NotFoundException("Account not found")

    const base = {
      username: account.username,
      email: account.email,
      phoneNumber: account.userDetail?.phoneNumber ?? null,
      gender: account.userDetail?.gender ?? null,
    }

    if (account.role === Role.CUSTOMER) {
      const customer =
        await this.customerService.getDetailByAccountId(tmpAccountId)
      return { ...base, role: Role.CUSTOMER, ...customer }
    }

    if (account.role === Role.PROPHET) {
      const prophet =
        await this.prophetService.getDetailByAccountId(tmpAccountId)
      return { ...base, role: Role.PROPHET, ...prophet }
    }

    throw new NotFoundException("Role not found")
  }

  async getAccountByUsername(username : string): Promise<Account> {
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
}
