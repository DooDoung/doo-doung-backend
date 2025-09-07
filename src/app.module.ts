import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PrismaModule } from "./db/prisma.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { AccountModule } from "./modules/account/account.module"
import { AuthModule } from "./modules/auth/auth.module"
import { ConfigModule } from "@nestjs/config"
import hashConfig from "@/config/hash.config"
import { ReviewModule } from "./modules/review/review.module"

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AccountModule,
    ReviewModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [hashConfig], // load all separate config files
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
