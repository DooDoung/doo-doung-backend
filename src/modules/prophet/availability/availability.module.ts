import { Module } from "@nestjs/common"
import { AvailabilityController } from "./availability.controller"
import { AvailabilityService } from "./availability.service"
import { ProphetRepository } from "../prophet.repository"
import { PrismaService } from "@/db/prisma.service"
import { UtilsModule } from "@/common/utils/utils.module"

@Module({
  imports: [UtilsModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, ProphetRepository, PrismaService],
})
export class AvailabilityModule {}
