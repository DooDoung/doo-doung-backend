import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
<<<<<<< HEAD
import { PrismaService } from "@/db/prisma.service"
=======
import { PrismaService } from "../../db/prisma.service"
>>>>>>> a10f17d (add: create get my account logic)

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByAccountId<S extends Prisma.CustomerSelect>(
    accountId: string,
    select: S
  ): Promise<Prisma.CustomerGetPayload<{ select: S }> | null> {
    return this.prisma.customer.findUnique({
      where: { accountId },
      select,
    })
  }
}
