const { customAlphabet } = require("nanoid")
import { PrismaService } from "@/db/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class NanoidGenerator {
  static alphabet: string =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  private nanoid

  constructor(private readonly prisma: PrismaService) {
    this.nanoid = customAlphabet(NanoidGenerator.alphabet, 16)
  }

  async generateId(): Promise<string> {
    let id = this.nanoid()

    while (true) {
      const existing = await this.prisma.account.findUnique({ where: { id } })
      if (!existing) {
        return id
      }
      id = this.nanoid() // retry if collision
    }
  }
}
