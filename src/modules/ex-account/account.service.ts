import { Injectable } from "@nestjs/common"
import { EXAccountRepository } from "./account.repository"
import { EXCreateAccountDto } from "./dto/create-account.dto"

@Injectable()
export class EXAccountService {
  constructor(private readonly repo: EXAccountRepository) {}

  create(dto: EXCreateAccountDto) {
    return this.repo.create(dto)
  }
}
