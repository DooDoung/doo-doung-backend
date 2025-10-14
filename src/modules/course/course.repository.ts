import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/db/prisma.service';
import { Prisma } from '@prisma/client'

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById<T extends Prisma.CourseSelect>(
    id: string,
    select: T,
  ): Promise<Prisma.CourseGetPayload<{ select: T}> | null> {
    return this.prisma.course.findUnique({
      where: { id },
      select,
    });
  }
}
