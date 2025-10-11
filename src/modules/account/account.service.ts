import { Injectable, NotFoundException } from "@nestjs/common"
import { AccountRepository } from "./account.repository"
import { Role } from "@prisma/client"
import { CustomerService } from "../customer/customer.service"
import { ProphetService } from "../prophet/prophet.service"
import { Account } from "@/common/types/account/account.types"
import {
  AccountResponseDto,
  CustomerAccountDto,
  ProphetAccountDto,
} from "./dto/get-account.dto"
import { HashService } from "@/common/utils/hash.service"
import {
  CustomerUpdateAccountDtoInput,
  ProphetUpdateAccountDto,
} from "./interface/update-account.interface"

@Injectable()
export class AccountService {
  constructor(
    private readonly repo: AccountRepository,
    private readonly customerService: CustomerService,
    private readonly prophetService: ProphetService,
    private readonly hash: HashService
  ) {}

  async getMyAccount(id: string): Promise<AccountResponseDto> {
    const account = await this.repo.findBaseById(id, {
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
        await this.customerService.getDetailByAccountId(id)
      return { ...base, role: Role.CUSTOMER, ...customer }
    }

    if (account.role === Role.PROPHET) {
      const prophet = await this.prophetService.getDetailByAccountId(id, true)
      return { ...base, role: Role.PROPHET, ...prophet }
    }

    throw new NotFoundException("Role not found")
  }

  async getAccountById(accountId: string): Promise<AccountResponseDto> {
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
        return {
          username: base.username,
          profileUrl: base.profileUrl,
          role: Role.CUSTOMER,
        }
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

  async getProfileUrl(username: string): Promise<string> {
    return await this.repo.getProfileUrl(username)
  }

  async createAccount(role: Role, dto: any): Promise<AccountResponseDto> {
    if (role === Role.CUSTOMER) {
      dto = dto as CustomerAccountDto
      const passwordHash = await this.hash.hashPassword(dto.password)
      const customerAccount = await this.repo.createBaseAccount(
        dto.username,
        dto.email,
        passwordHash,
        Role.CUSTOMER,
        {
          name: dto.name,
          lastname: dto.lastname,
          phoneNumber: dto.phoneNumber,
          gender: dto.gender,
        }
      )
      const customerDetail = await this.customerService.createDetail(
        customerAccount.accountId,
        {
          zodiacSign: dto.zodiacSign,
          birthDate: dto.birthDate,
          birthTime: dto.birthTime,
        }
      )
      return { ...customerDetail, ...customerAccount }
    } else if (role === Role.PROPHET) {
      dto = dto as ProphetAccountDto
      const passwordHash = await this.hash.hashPassword(dto.password)
      const prophetAccount = await this.repo.createBaseAccount(
        dto.username,
        dto.email,
        passwordHash,
        Role.PROPHET,
        {
          name: dto.name,
          lastname: dto.lastname,
          phoneNumber: dto.phoneNumber,
          gender: dto.gender,
        }
      )
      const prophetDetail = await this.prophetService.createProphetDetail(
        prophetAccount.accountId,
        {
          txAccounts: dto.txAccounts ?? [],
          lineId: dto.lineId,
        }
      )
      return { ...prophetDetail, ...prophetAccount }
    } else throw new NotFoundException("Role not found")
  }
  async updateAccount(id: string, dto: any): Promise<AccountResponseDto> {
    const role = dto.role;
    if (role === Role.CUSTOMER) {
      dto = dto as CustomerUpdateAccountDtoInput
      const passwordHash = dto.password
        ? await this.hash.hashPassword(dto.password)
        : undefined
      const updatedBase = await this.repo.updateBaseAccount(
        id,
        dto.usermame,
        dto.email,
        passwordHash,
        {
          name: dto.firstName,
          lastname: dto.lastName,
          phoneNumber: dto.phoneNumber,
          gender: dto.gender,
          profileUrl: dto.profileUrl,
        }
      )
      const updatedCustomerDetail =
        await this.customerService.updateCustomerDetail(id, {
          zodiacSign: dto.zodiacSign,
          birthDate: dto.birthDate,
          birthTime: dto.birthTime,
        })
      return { ...updatedCustomerDetail, ...updatedBase }
    } else if (role === Role.PROPHET) {
      dto = dto as ProphetUpdateAccountDto
      const passwordHash = dto.password
        ? await this.hash.hashPassword(dto.password)
        : undefined
      const updatedBase = await this.repo.updateBaseAccount(
        id,
        dto.usermame,
        dto.email,
        passwordHash,
        {
          name: dto.firstName,
          lastname: dto.lastName,
          phoneNumber: dto.phoneNumber,
          gender: dto.gender,
          profileUrl: dto.profileUrl,
        }
      )
      const updatedProphetDetail =
        await this.prophetService.updateProphetDetail(id, dto.lineId)
      return { ...updatedProphetDetail, ...updatedBase }
    } else throw new NotFoundException("Role not found")
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
