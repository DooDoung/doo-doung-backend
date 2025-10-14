import { Module } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

@Module({
  providers: [CourseRepository, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
