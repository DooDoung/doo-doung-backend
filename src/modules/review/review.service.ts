import { Injectable, NotFoundException } from "@nestjs/common"
import { ReviewRepository } from "./review.repository"
import { CustomerService } from "../customer/customer.service"
import { GetReviewsResponseDto } from "./dto/get-review.dto"

@Injectable()
export class ReviewService {
  constructor(
    private readonly repo: ReviewRepository,
    private readonly customerService: CustomerService
  ) {}

  async getReviewByAccountId(
    accountId: string
  ): Promise<GetReviewsResponseDto> {
    const customer =
      await this.customerService.getCustomerByAccountId(accountId)
    if (!customer?.id) {
      throw new NotFoundException("Customer not found")
    }

    //Todo: add validate own account
    if (customer.isPublic) {
      const reviewData = await this.repo.findByCustomerId(customer.id)
      const reviews = reviewData.map(r => ({
        score: r.score,
        description: r.description,
        courseName: r.booking.course.courseName,
      }))
      return { reviews }
    } else {
      return { reviews: [] }
    }
  }

  async getReviewByCourseId(courseId: string): Promise<GetReviewsResponseDto> {
    const reviewData = await this.repo.findByCourseId(courseId)
    const reviews = reviewData.map(r => ({
      score: r.score,
      description: r.description,
      courseName: r.booking.course.courseName,
    }))
    return { reviews }
  }
}
