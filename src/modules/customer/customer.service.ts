import { Injectable } from "@nestjs/common"
import { CustomerRepository } from "./customer.repository"

@Injectable()
export class CustomerService {
  constructor(private readonly repo: CustomerRepository) {}

  async getDetailByAccountId(accountId: string) {
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
  async getCustomerByAccountId(accountId: string) {
    const customer = await this.repo.findByAccountId(accountId, {
      id: true,
      isPublic: true,
    })
    return { id: customer?.id, isPublic: customer?.isPublic }
  }
}
