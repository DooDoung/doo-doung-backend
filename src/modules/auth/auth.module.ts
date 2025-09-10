// auth.module.ts
import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AccountModule } from "src/modules/account/account.module"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { ResetPasswordTokenRepository } from "./reset-password-token.repository"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { UtilsModule } from "@/common/utils/utils.module"
import jwtConfig from "./config/jwt.config"
import { MailModule } from "../mail/mail.module"

@Module({
  imports: [
    AccountModule,
    UtilsModule,
    MailModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>("jwt.secret"),
        signOptions: {
          expiresIn: config.get<string>("jwt.expiresIn"),
        },
      }),
    }),
  ],
  providers: [AuthService, ResetPasswordTokenRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
