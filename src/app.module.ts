import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { PrismaModule } from "./db/prisma.module"
import { EXAccountModule } from "./modules/ex-account/account.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"

@Module({
  imports: [PrismaModule, EXAccountModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
