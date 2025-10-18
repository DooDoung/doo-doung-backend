import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { CourseRepository } from "./course.repository";
import { UtilsModule } from "@/common/utils/utils.module";

@Module({
    imports: [UtilsModule],
    controllers: [CourseController],
    providers: [CourseService, CourseRepository],
    exports: [CourseService],
})
export class CourseModule {}