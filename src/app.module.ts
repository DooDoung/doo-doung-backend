import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PrismaModule } from "./db/prisma.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { AccountModule } from "./modules/account/account.module"
import { ReviewModule } from "./modules/review/review.module"

@Module({
  imports: [PrismaModule, AccountModule, ReviewModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
