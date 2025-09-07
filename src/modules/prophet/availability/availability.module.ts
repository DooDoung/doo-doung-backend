import { Module } from "@nestjs/common"
import { AvailabilityController } from "./availability.controller"
import { AvailabilityService } from "./availability.service"
import { ProphetRepository } from "../../../prophet/prophet.repository"
import { PrismaService } from "@/db/prisma.service"

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService, ProphetRepository, PrismaService],
})
export class AvailabilityModule {}
