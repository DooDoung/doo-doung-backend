import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PrismaModule } from "./db/prisma.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { AccountModule } from "./modules/account/account.module"
import { AuthModule } from "./modules/auth/auth.module"
import { ConfigModule } from "@nestjs/config"
import { ReportModule } from "./modules/report/report.module"
import { ReviewModule } from "./modules/review/review.module"
import appConfig from "./config/app.config"
import corsConfig from "./config/cors.config"
import { AvailabilityModule } from "./modules/prophet/availability/availability.module"
import { TransactionAccountModule } from "./modules/prophet/tx-account.module"

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AccountModule,
    ReportModule,
    ReviewModule,
    TransactionAccountModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [corsConfig, appConfig], // load all separate config files
    }),
    AvailabilityModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
