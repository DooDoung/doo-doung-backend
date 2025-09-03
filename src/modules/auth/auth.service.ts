// auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AccountService } from "src/modules/account/account.service"
import { comparePassword } from "src/utils/hash.util"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { LoginResult } from "./interface/login-result.interface"
import { Account } from "src/common/types/account.types"

type JwtPayload = {
  sub: string
  username: string
  email: string
  role: string
}

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async login(username: string, pass: string): Promise<LoginResult> {
    const user: Account = await this.accountService.getAccountByUsername(username)
    if (!user) throw new UnauthorizedException()

    const ok = await comparePassword(pass, user.passwordHash)
    if (!ok) throw new UnauthorizedException()

    const safeUser = {
      id: String(user.id),
      username: user.username,
      email: user.email,
      role: user.role,
    }

    const payload: JwtPayload = {
      sub: safeUser.id,
      username: safeUser.username,
      email: safeUser.email,
      role: safeUser.role,
    }

    const secret = this.config.get<string>("JWT_ACCESS_SECRET")!
    const expiresIn = this.config.get<string>("JWT_ACCESS_EXPIRES") || "7d"

    // sign jwt token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    })

    // get expr timestamp
    const decoded = this.jwtService.decode(accessToken) as {
      exp?: number
    } | null

    return {
      user: safeUser,
      accessToken,
      expiresAt: (decoded?.exp ?? 0) * 1000,
    }
  }
}
