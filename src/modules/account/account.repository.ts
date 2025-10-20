import { ConflictException, Injectable } from "@nestjs/common"
import { Prisma, Role, Sex } from "@prisma/client"
import { PrismaService } from "../../db/prisma.service"
import { NanoidService } from "../../common/utils/nanoid"

type SafeAccountSelect = Omit<Prisma.AccountSelect, "passwordHash"> & {
  passwordHash?: never
}

@Injectable()
export class AccountRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nanoid: NanoidService
  ) {}

  findBaseById<S extends SafeAccountSelect>(
    id: string,
    select: S
  ): Promise<Prisma.AccountGetPayload<{ select: S }> | null> {
    return this.prisma.account.findUnique({
      where: { id },
      select,
    })
  }

  findAccountByUsername<S extends Prisma.AccountSelect>(
    username: string,
    select: S
  ): Promise<Prisma.AccountGetPayload<{ select: S }> | null> {
    return this.prisma.account.findUnique({
      where: { username },
      select,
    })
  }

  async getProfileUrl(username: string): Promise<string> {
    const reqAccount = await this.findAccountByUsername(username, {
      id: true,
    })
    if (reqAccount) {
      const tmp = await this.prisma.userDetail.findUnique({
        where: { accountId: reqAccount.id },
        select: { profileUrl: true },
      })
      return tmp?.profileUrl ?? ""
    }
    return ""
  }

  async createBaseAccount(
    username: string,
    email: string,
    passwordHash: string,
    role: Role,
    userDetail: {
      name: string
      lastname: string
      phoneNumber: string
      gender: Sex
    }
  ) {
    const id = await this.nanoid.generateId()

    try {
      // Create account record
      const account = await this.prisma.account.create({
        data: {
          id,
          username,
          email,
          role,
          passwordHash,
        } as Prisma.AccountUncheckedCreateInput,
      })

      // Create related user detail record
      const user_detail = await this.prisma.userDetail.create({
        data: {
          accountId: id,
          name: userDetail.name,
          lastname: userDetail.lastname,
          phoneNumber: userDetail.phoneNumber,
          gender: userDetail.gender,
        } as Prisma.UserDetailUncheckedCreateInput,
      })

      return { ...account, ...user_detail }
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const target = (err.meta?.target as string[]) ?? []
        if (target.includes("username")) {
          throw new ConflictException("Username already exists")
        }
        if (target.includes("email")) {
          throw new ConflictException("Email already exists")
        }
        throw new ConflictException(
          "Account already exists with provided credentials"
        )
      }
      throw err
    }
  }

  async findAccountByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
    })
  }

  async updatePassword(accountId: string, hashedPassword: string) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { passwordHash: hashedPassword },
    })
  }

  async updateBaseAccount(
    id: string,
    username?: string,
    email?: string,
    passwordHash?: string,
    userDetail?: {
      name?: string | null
      lastname?: string | null
      phoneNumber?: string | null
      gender?: Sex | null
      profileUrl?: string | null
    }
  ) {
    const updatedAccount = await this.prisma.account.update({
      where: { id },
      data: {
        username: username,
        email: email,
        passwordHash: passwordHash,
      } as Prisma.AccountUncheckedUpdateInput,
    })
    const updatedUserDetail = await this.prisma.userDetail.update({
      where: { accountId: id },
      data: userDetail as Prisma.UserDetailUncheckedUpdateInput,
    })
    return { ...updatedUserDetail, ...updatedAccount }
  }
}
