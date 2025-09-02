import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "../../db/prisma.service"

@Injectable()
export class ProphetRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByAccountId<S extends Prisma.ProphetSelect>(
    accountId: string,
    select: S
  ): Promise<Prisma.ProphetGetPayload<{ select: S }> | null> {
    return this.prisma.prophet.findUnique({
      where: { accountId },
      select,
    })
  }
}
