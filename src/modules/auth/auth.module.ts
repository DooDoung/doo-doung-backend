// auth.module.ts
import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AccountModule } from "src/modules/account/account.module"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { HashUtils } from "@/common/utils/hash.util"
import jwtConfig from "./config/jwt.config"

// TO DO: include this module in app module to use
@Module({
  imports: [
    AccountModule,
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
  providers: [AuthService, HashUtils],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
