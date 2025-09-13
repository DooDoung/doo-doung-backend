import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/db/prisma.service"
import { Prisma, ZodiacSign } from "@prisma/client"
import { NanoidService } from "../../common/utils/nanoid"

@Injectable()
export class CustomerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nanoid: NanoidService
  ) {}

  findByAccountId<S extends Prisma.CustomerSelect>(
    accountId: string,
    select: S
  ): Promise<Prisma.CustomerGetPayload<{ select: S }> | null> {
    return this.prisma.customer.findUnique({
      where: { accountId },
      select,
    })
  }
  async createCustomerDetail(
    zodiacSign: ZodiacSign,
    birthDate: string,
    birthTime: string,
    accountId: string
  ) {
    const id = await this.nanoid.generateId()
    return await this.prisma.customer.create({
      data: {
        id: id,
        zodiacSign: zodiacSign,
        birthDate: new Date(birthDate),
        birthTime: new Date(`1970-01-01T${birthTime}Z`),
        accountId: accountId,
      } as Prisma.CustomerUncheckedCreateInput,
    })
  }
}
