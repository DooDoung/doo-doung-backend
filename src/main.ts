import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { TransformInterceptor } from "./common/interceptors/transform.interceptor"
import { ConfigService } from "@nestjs/config"
import { setupSwagger } from "./config/swagger.config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  const origins = config.get<string[]>("cors.origins")

  app.enableCors({
    origin: origins,
    credentials: true,
  })
  setupSwagger(app)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 8000)
}
bootstrap()
