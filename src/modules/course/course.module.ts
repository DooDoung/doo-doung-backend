import { Module } from "@nestjs/common"
import { CourseRepository } from "./course.repository"
import { CourseService } from "./course.service"
import { PrismaService } from "@/db/prisma.service"

@Module({
  providers: [CourseRepository, CourseService, PrismaService],
  exports: [CourseService],
})
export class CourseModule {}
