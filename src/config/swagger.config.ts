import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Doo-Doung API")
    .setDescription("Horoscope platform API documentation")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" },
      "bearer"
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "list",
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  })

  return document
}
