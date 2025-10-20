import { Module, forwardRef } from "@nestjs/common"
import { CourseController } from "./course.controller"
import { CourseService } from "./course.service"
import { CourseRepository } from "./course.repository"
import { UtilsModule } from "@/common/utils/utils.module"
import { ProphetModule } from "@/modules/prophet/prophet.module"
import { UtilsModule } from "@/common/utils/utils.module"

@Module({
  imports: [forwardRef(() => ProphetModule), UtilsModule],
  controllers: [CourseController],
  providers: [CourseRepository, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
