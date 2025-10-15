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
import { APP_GUARD } from "@nestjs/core"
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard"
import { RolesGuard } from "./common/guards/roles.guard"
import { BookingModule } from "./modules/booking/booking.module"
import { PaymentModule } from "./modules/payment/payment.module"
import { CustomerModule } from "./modules/customer/customer.module"
import { ProphetModule } from "./modules/prophet/prophet.module"
import { TransactionAccountModule } from "./modules/prophet/tx-account.module"
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AccountModule,
    ReportModule,
    ReviewModule,
    PaymentModule,
    BookingModule,
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [corsConfig, appConfig], // load all separate config files
    }),
    AvailabilityModule,
    ProphetModule,
    TransactionAccountModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
