import { Module } from "@nestjs/common"
import { ProphetService } from "./prophet.service"
import { ProphetRepository } from "./prophet.repository"
import { PrismaService } from "@/db/prisma.service"
import { UtilsModule } from "@/common/utils/utils.module"

@Module({
  imports: [UtilsModule],
  providers: [ProphetService, ProphetRepository, PrismaService],
  exports: [ProphetService],
})
export class ProphetModule {}
