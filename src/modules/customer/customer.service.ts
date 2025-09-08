import { Injectable } from "@nestjs/common"
import { CustomerRepository } from "./customer.repository"
import { ZodiacSign } from "@prisma/client";

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
  async createDetail(accountId : string,dto : { zodiacSign : ZodiacSign, birthDate : string, birthTime : string}) {
    return await this.repo.createCustomerDetail(dto.zodiacSign, dto.birthDate, dto.birthTime, accountId);
  }
}
