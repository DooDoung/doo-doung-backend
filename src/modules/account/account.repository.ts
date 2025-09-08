import { Injectable } from "@nestjs/common"
import { Prisma, Role, Sex } from "@prisma/client"
import { PrismaService } from "../../db/prisma.service"
import { NanoidGenerator } from "../../common/utils/nanoid"

type SafeAccountSelect = Omit<Prisma.AccountSelect, "passwordHash"> & {
  passwordHash?: never
}

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}
  private static nanoid = new NanoidGenerator(new PrismaService());
  findBaseById<S extends SafeAccountSelect>(
    id: string,
    select: S
  ): Promise<Prisma.AccountGetPayload<{ select: S }> | null> {
    return this.prisma.account.findUnique({
      where: { id },
      select,
    })
  }
  async createBase(
    username: string, 
    email : string,
    passwordHash : string, 
    role : Role, 
    userDetail : 
      {
        name : string,
        lastname : string ,
        phoneNumber : string, 
        gender : Sex 
      }
    ) 
    {
    const id = await AccountRepository.nanoid.generateId();
    await this.prisma.account.create({
      data: {
        id : id,
        username : username,
        email : email,
        role : role,
        passwordHash : passwordHash,
      } as Prisma.AccountUncheckedCreateInput,
    });
    await this.prisma.userDetail.create({
      data: {
        accountId : id,
        name : userDetail.name,
        lastname : userDetail.lastname,
        phoneNumber : userDetail.phoneNumber,
        gender : userDetail.gender
      } as Prisma.UserDetailUncheckedCreateInput,
    });
    return id;
  }
}