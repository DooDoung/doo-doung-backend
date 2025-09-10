import { Injectable } from "@nestjs/common"
import { CustomerRepository } from "./customer.repository"
import { CustomerDetail } from "../account/interface/customer-detail.interface"

@Injectable()
export class CustomerService {
  constructor(private readonly repo: CustomerRepository) {}

  async getDetailByAccountId(accountId: string) {
    const customer = await this.repo.findByAccountId(accountId, {
      zodiacSign: true,
      birthDate: true,
      birthTime: true,
    })
    return {
      zodiacSign: customer?.zodiacSign ?? null,
      birthDate: customer?.birthDate ?? null,
      birthTime: customer?.birthTime ?? null,
    }
  }
  async createDetail(accountId: string, detail: CustomerDetail) {
    return await this.repo.createCustomerDetail(
      detail.zodiacSign,
      detail.birthDate,
      detail.birthTime,
      accountId
    )
  }
}
