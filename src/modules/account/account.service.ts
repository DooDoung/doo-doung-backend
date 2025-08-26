import { Injectable } from "@nestjs/common"
import { AccountRepository } from "./account.repository"
import { CreateAccountDto } from "./dto/create-account.dto"

@Injectable()
export class AccountService {
  constructor(private readonly repo: AccountRepository) {}

  create(dto: CreateAccountDto) {
    return this.repo.create(dto)
  }
}
