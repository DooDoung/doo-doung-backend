import { Injectable } from "@nestjs/common"
import { CustomerRepository } from "./customer.repository"
import {
  CustomerBasic,
  CustomerDetail,
  CustomerAccount,
} from "./interface/customer.interface"
import { ZodiacSign } from "@prisma/client"

@Injectable()
export class CustomerService {
  constructor(private readonly repo: CustomerRepository) {}

  async getDetailByAccountId(accountId: string): Promise<CustomerDetail> {
    const customer = await this.repo.findByAccountId(accountId, {
      zodiacSign: true,
      birthDate: true,
      birthTime: true,
      isPublic: true,
    })
    return {
      zodiacSign: customer?.zodiacSign,
      birthDate: customer?.birthDate,
      birthTime: customer?.birthTime,
      isPublic: customer?.isPublic,
    }
  }

  async getCustomerByAccountId(accountId: string): Promise<CustomerBasic> {
    const customer = await this.repo.findByAccountId(accountId, {
      id: true,
      isPublic: true,
    })
    return { id: customer?.id, isPublic: customer?.isPublic }
  }

  async getAccountByCustomerId(customerId: string): Promise<CustomerAccount> {
    const customer = await this.repo.findByCustomerId(customerId, {
      id: true,
      accountId: true,
    })
    return { id: customer?.id, accountId: customer?.accountId }
  }

  async createDetail(
    accountId: string,
    dto: { zodiacSign: ZodiacSign; birthDate: string; birthTime: string }
  ) {
    return await this.repo.createCustomerDetail(
      dto.zodiacSign,
      dto.birthDate,
      dto.birthTime,
      accountId
    )
  }

  async updateCustomerDetail(
    accountId: string,
    userDetail: {
      zodiacSign?: ZodiacSign
      birthDate?: Date
      birthTime?: Date
    }
  ) {
    return await this.repo.updateCustomerDetail(accountId, userDetail)
  }
}
