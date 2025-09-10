// utils/utils.module.ts
import { Module } from "@nestjs/common"
import { HashService } from "./hash.service"
import { GenerateService } from "./generate.service"
import hashConfig from "@/config/hash.config"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forFeature(hashConfig),
  ],
  providers: [HashService, GenerateService],
  exports: [HashService, GenerateService],
})
export class UtilsModule {}
