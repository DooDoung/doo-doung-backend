import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepo: CourseRepository) {}

  async getCoursePriceById(
    id: string,
  ): Promise<Decimal> {
    const course = await this.courseRepo.findById(id, {
        price: true
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course?.price;
  }
}
