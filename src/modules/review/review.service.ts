import { Injectable, NotFoundException } from "@nestjs/common"
import { ReviewRepository } from "@/modules/review/review.repository"
import { CustomerService } from "@/modules/customer/customer.service"
import {
  GetReviewsResponseDto,
  GetReviewsForCourseResponseDto,
} from "@/modules/review/dto/get-review.dto"
import { AccountService } from "@/modules/account/account.service"

@Injectable()
export class ReviewService {
  constructor(
    private readonly repo: ReviewRepository,
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService
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
        updatedAt: r.updatedAt,
      }))
      return { reviews }
    } else {
      return { reviews: [] }
    }
  }

  async getReviewByCourseId(
    courseId: string
  ): Promise<GetReviewsForCourseResponseDto> {
    const reviewData = await this.repo.findByCourseId(courseId)
    const accountDataList = await Promise.all(
      reviewData.map(r =>
        this.accountService.getAccountById(r.booking.customer.accountId)
      )
    )
    const reviews = reviewData.map((r, i) => ({
      score: r.score,
      description: r.description,
      courseName: r.booking.course.courseName,
      userName: accountDataList[i]?.username ?? r.booking.customer.accountId,
      profileUrl: accountDataList[i]?.profileUrl ?? "",
      updatedAt: r.updatedAt,
    }))
    return { reviews }
  }
}
