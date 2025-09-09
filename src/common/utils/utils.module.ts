// utils/utils.module.ts
import { Module } from "@nestjs/common"
import { HashService } from "./hash.service"
import { GenerateService } from "./generate.service"

@Module({
  providers: [HashService, GenerateService],
  exports: [HashService, GenerateService],
})
export class UtilsModule {}
