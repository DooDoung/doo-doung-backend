// auth.module.ts
import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AccountModule } from "src/modules/account/account.module"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { ConfigModule, ConfigService } from "@nestjs/config"

// TO DO: include this module in app module to use
@Module({
  imports: [
    AccountModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>("JWT_ACCESS_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_ACCESS_EXPIRES") || "7d",
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
