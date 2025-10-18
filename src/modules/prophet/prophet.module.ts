import { Module } from "@nestjs/common"
import { ProphetService } from "./prophet.service"
import { ProphetRepository } from "./prophet.repository"
import { PrismaService } from "@/db/prisma.service"
import { UtilsModule } from "@/common/utils/utils.module"
import { CourseModule } from "@/modules/course/course.module"
import { ProphetCourseController } from "./course/course.controller"
import { AvailabilityModule } from "./availability/availability.module"

@Module({
  imports: [UtilsModule, CourseModule, AvailabilityModule],
  controllers: [ProphetCourseController],
  providers: [ProphetService, ProphetRepository, PrismaService],
  exports: [ProphetService],
})
export class ProphetModule {}
