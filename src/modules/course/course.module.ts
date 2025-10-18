import { Module, forwardRef } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseService } from "./course.service"
import { CourseController } from "./course.controller"
import { ProphetModule } from "@/modules/prophet/prophet.module"

@Module({
  imports: [forwardRef(() => ProphetModule)],
  controllers: [CourseController],
  providers: [CourseRepository, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
