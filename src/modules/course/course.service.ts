import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CourseForBookingResponse } from './interface/course.interface';


@Injectable()
export class CourseService {
  constructor(private readonly courseRepo: CourseRepository) {}

  async getCourseForBookingById(
    id: string,
  ): Promise<CourseForBookingResponse> {
    const course = await this.courseRepo.findById(id, 
        {
            prophetId: true,
            price : true,
        }
    );

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    
    const res : CourseForBookingResponse = {
        prophetId: course.prophetId,
        price: course.price
    }
    return res;
  }
}
