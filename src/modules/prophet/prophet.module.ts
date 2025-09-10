import { Module } from "@nestjs/common"
import { ProphetService } from "./prophet.service"
import { ProphetRepository } from "./prophet.repository"
import { PrismaService } from "@/db/prisma.service"
import { NanoidGenerator } from "@/common/utils/nanoid"

@Module({
  providers: [
    ProphetService,
    ProphetRepository,
    PrismaService,
    NanoidGenerator,
  ],
  exports: [ProphetService],
})
export class ProphetModule {}
