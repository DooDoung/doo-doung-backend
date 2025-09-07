import { Module } from "@nestjs/common"
import { ProphetService } from "./prophet.service"
import { ProphetRepository } from "./prophet.repository"
import { PrismaService } from "@/db/prisma.service"

@Module({
  providers: [ProphetService, ProphetRepository, PrismaService],
  exports: [ProphetService],
})
export class ProphetModule {}
