import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcrypt"

@Injectable()
export class HashUtils {
  constructor(private configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>("hash.saltRounds", 10)
    return bcrypt.hash(password, saltRounds)
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
