import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PrismaModule } from "./db/prisma.module"
import { AccountModule } from "./modules/account/account.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"

@Module({
  imports: [PrismaModule, AccountModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
