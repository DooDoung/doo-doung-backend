import { Module } from "@nestjs/common"
import { TransactionAccountController } from "./tx-account.controller"
import { TransactionAccountService } from "./tx-account.service"
import { TransactionAccountRepository } from "./tx-account.repository"
import { ProphetModule } from "./prophet.module"
import { UtilsModule } from "../../common/utils/utils.module"
import { PrismaModule } from "../../db/prisma.module"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard"

@Module({
  imports: [
    ProphetModule,
    UtilsModule,
    PrismaModule,
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
  controllers: [TransactionAccountController],
  providers: [
    TransactionAccountService,
    TransactionAccountRepository,
    JwtAuthGuard,
  ],
  exports: [TransactionAccountService, TransactionAccountRepository],
})
export class TransactionAccountModule {}
