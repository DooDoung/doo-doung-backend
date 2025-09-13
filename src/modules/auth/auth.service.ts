// auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common"
import { AccountService } from "src/modules/account/account.service"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { LoginResponseDto } from "./dto/login-result.dto"
import { Account } from "@/common/types/account/account.types"
import { HashService } from "@/common/utils/hash.service"
import { ResetPasswordTokenRepository } from "./reset-password-token.repository"
import { MailService } from "../mail/mail.service"
import { NanoidService } from "@/common/utils/nanoid"
import { JwtPayload } from "@/modules/auth/type/jwt-payload.type"

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly hashUtils: HashService,
    private readonly nanoidUtils: NanoidService,
    private readonly tokenRepo: ResetPasswordTokenRepository,
    private readonly mailService: MailService
  ) {}

  async login(username: string, pass: string): Promise<LoginResponseDto> {
    const user: Account =
      await this.accountService.getAccountByUsername(username)
    if (!user) throw new UnauthorizedException("Invalid username or password")

    const ok = await this.hashUtils.comparePassword(pass, user.passwordHash)
    if (!ok) throw new UnauthorizedException("Invalid username or password")

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

    const accessToken = await this.jwtService.signAsync(payload)

    // get expr timestamp
    const decoded = this.jwtService.decode(accessToken) as {
      exp?: number
    } | null

    if (!decoded?.exp) {
      throw new InternalServerErrorException(
        "Malformed JWT: missing expiration"
      )
    }

    return {
      user: safeUser,
      accessToken,
      expiresAt: decoded.exp * 1000,
    }
  }

  async requestResetPassword(email: string): Promise<void> {
    const account = await this.accountService.findAccountByEmail(email)
    if (!account) throw new NotFoundException("Account not found")
    const token = await this.nanoidUtils.generateId()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

    await this.tokenRepo.create(account.id, token, expiresAt)

    try {
      await this.mailService.sendPasswordReset(account.email, token)
    } catch (e) {
      throw new InternalServerErrorException(
        `Could not send reset email: ${String(e)}`
      )
    }
  }

  async confirmResetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const resetToken = await this.tokenRepo.findValidToken(token)
    if (!resetToken) {
      throw new BadRequestException("Invalid or expired token")
    }

    const hashedPassword = await this.hashUtils.hashPassword(newPassword)
    await this.accountService.updatePassword(
      resetToken.accountId,
      hashedPassword
    )
    try {
      await this.tokenRepo.markUsed(resetToken.id)
    } catch (err) {
      throw new InternalServerErrorException(`Token not found: ${err}`)
    }
  }
}
