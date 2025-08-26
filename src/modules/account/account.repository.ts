import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { Prisma } from "@prisma/client"

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AccountCreateInput) {
    return this.prisma.account.create({ data })
  }
}
