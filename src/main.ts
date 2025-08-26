import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalInterceptors(new LoggingInterceptor())

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 8000)
}
bootstrap()
