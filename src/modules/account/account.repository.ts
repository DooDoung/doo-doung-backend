import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
<<<<<<< HEAD
import { PrismaService } from "@/db/prisma.service"
=======
import { PrismaService } from "../../db/prisma.service"
>>>>>>> a10f17d (add: create get my account logic)

type SafeAccountSelect = Omit<Prisma.AccountSelect, "passwordHash"> & {
  passwordHash?: never
}

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}
  findBaseById<S extends SafeAccountSelect>(
    id: string,
    select: S
  ): Promise<Prisma.AccountGetPayload<{ select: S }> | null> {
    return this.prisma.account.findUnique({
      where: { id },
      select,
    })
  }
<<<<<<< HEAD

  findAccountByUsername<S extends Prisma.AccountSelect>(
    username: string,
    select: S
  ): Promise<Prisma.AccountGetPayload<{ select: S }> | null> {
    return this.prisma.account.findUnique({
      where: { username },
      select,
    })
  }
=======
>>>>>>> a10f17d (add: create get my account logic)
}
