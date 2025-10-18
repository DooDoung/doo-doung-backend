import { Module, forwardRef } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseService } from "./course.service"
import { CourseController } from "./course.controller"
import { PrismaService } from "@/db/prisma.service"
import { ProphetModule } from "@/modules/prophet/prophet.module"

@Module({
  imports: [forwardRef(() => ProphetModule)],
  controllers: [CourseController],
  providers: [CourseRepository, CourseService, PrismaService],
  exports: [CourseService],
})
export class CourseModule {}
