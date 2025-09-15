// utils/utils.module.ts
import { Module } from "@nestjs/common"
import { HashService } from "./hash.service"
import hashConfig from "@/config/hash.config"
import { ConfigModule } from "@nestjs/config"
import { NanoidService } from "./nanoid"

@Module({
  imports: [ConfigModule.forFeature(hashConfig)],
  providers: [HashService, NanoidService],
  exports: [HashService, NanoidService],
})
export class UtilsModule {}
