import { Test, TestingModule } from "@nestjs/testing"
import { NotFoundException } from "@nestjs/common"
import { ReviewService } from "./review.service"
import { ReviewRepository } from "./review.repository"
import { CustomerService } from "@/modules/customer/customer.service"
import { AccountService } from "@/modules/account/account.service"
import { CreateReviewReqDto } from "./dto/create-review.dto"

describe("ReviewService", () => {
  let service: ReviewService
  let reviewRepository: jest.Mocked<ReviewRepository>
  let customerService: jest.Mocked<CustomerService>
  let accountService: jest.Mocked<AccountService>

  const mockReviewRepository = {
    findByCustomerId: jest.fn(),
    findByCourseId: jest.fn(),
    create: jest.fn(),
  }

  const mockCustomerService = {
    getCustomerByAccountId: jest.fn(),
  }

  const mockAccountService = {
    getAccountById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: ReviewRepository,
          useValue: mockReviewRepository,
        },
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile()

    service = module.get<ReviewService>(ReviewService)
    reviewRepository = module.get(ReviewRepository)
    customerService = module.get(CustomerService)
    accountService = module.get(AccountService)

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("getReviewByAccountId", () => {
    const accountId = "account-123"
    const customerId = "customer-456"

    it("should return reviews when customer exists and isPublic is true", async () => {
      // Arrange
      const mockCustomer = {
        id: customerId,
        isPublic: true,
      }

      const mockReviewData = [
        {
          score: 5,
          description: "Great course!",
          booking: {
            course: {
              courseName: "Tarot Reading 101",
            },
          },
          updatedAt: new Date("2025-01-15"),
        },
        {
          score: 4,
          description: "Very informative",
          booking: {
            course: {
              courseName: "Advanced Astrology",
            },
          },
          updatedAt: new Date("2025-01-20"),
        },
      ]

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )
      reviewRepository.findByCustomerId.mockResolvedValue(mockReviewData as any)

      // Act
      const result = await service.getReviewByAccountId(accountId)

      // Assert
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        accountId
      )
      expect(reviewRepository.findByCustomerId).toHaveBeenCalledWith(customerId)
      expect(result).toEqual({
        reviews: [
          {
            score: 5,
            description: "Great course!",
            courseName: "Tarot Reading 101",
            updatedAt: new Date("2025-01-15"),
          },
          {
            score: 4,
            description: "Very informative",
            courseName: "Advanced Astrology",
            updatedAt: new Date("2025-01-20"),
          },
        ],
      })
    })

    it("should return empty reviews when customer exists but isPublic is false", async () => {
      // Arrange
      const mockCustomer = {
        id: customerId,
        isPublic: false,
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )

      // Act
      const result = await service.getReviewByAccountId(accountId)

      // Assert
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        accountId
      )
      expect(reviewRepository.findByCustomerId).not.toHaveBeenCalled()
      expect(result).toEqual({ reviews: [] })
    })

    it("should throw NotFoundException when customer is null", async () => {
      // Arrange
      customerService.getCustomerByAccountId.mockResolvedValue(null as any)

      // Act & Assert
      await expect(service.getReviewByAccountId(accountId)).rejects.toThrow(
        NotFoundException
      )
      await expect(service.getReviewByAccountId(accountId)).rejects.toThrow(
        "Customer not found"
      )
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        accountId
      )
      expect(reviewRepository.findByCustomerId).not.toHaveBeenCalled()
    })

    it("should throw NotFoundException when customer id is undefined", async () => {
      // Arrange
      const mockCustomer = {
        id: undefined,
        isPublic: true,
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )

      // Act & Assert
      await expect(service.getReviewByAccountId(accountId)).rejects.toThrow(
        NotFoundException
      )
      await expect(service.getReviewByAccountId(accountId)).rejects.toThrow(
        "Customer not found"
      )
    })

    it("should return empty reviews array when customer has no reviews", async () => {
      // Arrange
      const mockCustomer = {
        id: customerId,
        isPublic: true,
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )
      reviewRepository.findByCustomerId.mockResolvedValue([])

      // Act
      const result = await service.getReviewByAccountId(accountId)

      // Assert
      expect(result).toEqual({ reviews: [] })
      expect(reviewRepository.findByCustomerId).toHaveBeenCalledWith(customerId)
    })

    it("should handle reviews with null descriptions", async () => {
      // Arrange
      const mockCustomer = {
        id: customerId,
        isPublic: true,
      }

      const mockReviewData = [
        {
          score: 3,
          description: null,
          booking: {
            course: {
              courseName: "Palm Reading",
            },
          },
          updatedAt: new Date("2025-01-10"),
        },
      ]

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )
      reviewRepository.findByCustomerId.mockResolvedValue(mockReviewData as any)

      // Act
      const result = await service.getReviewByAccountId(accountId)

      // Assert
      expect(result).toEqual({
        reviews: [
          {
            score: 3,
            description: null,
            courseName: "Palm Reading",
            updatedAt: new Date("2025-01-10"),
          },
        ],
      })
    })
  })

  describe("getReviewByCourseId", () => {
    const courseId = "course-789"

    it("should return reviews with account information for a course", async () => {
      // Arrange
      const mockReviewData = [
        {
          score: 5,
          description: "Excellent!",
          booking: {
            course: {
              courseName: "Numerology Basics",
            },
            customer: {
              accountId: "account-111",
            },
          },
          updatedAt: new Date("2025-02-01"),
        },
        {
          score: 4,
          description: "Good experience",
          booking: {
            course: {
              courseName: "Numerology Basics",
            },
            customer: {
              accountId: "account-222",
            },
          },
          updatedAt: new Date("2025-02-05"),
        },
      ]

      const mockAccounts = [
        {
          username: "user1",
          profileUrl: "https://example.com/user1.jpg",
        },
        {
          username: "user2",
          profileUrl: "https://example.com/user2.jpg",
        },
      ]

      reviewRepository.findByCourseId.mockResolvedValue(mockReviewData as any)
      accountService.getAccountById
        .mockResolvedValueOnce(mockAccounts[0] as any)
        .mockResolvedValueOnce(mockAccounts[1] as any)

      // Act
      const result = await service.getReviewByCourseId(courseId)

      // Assert
      expect(reviewRepository.findByCourseId).toHaveBeenCalledWith(courseId)
      expect(accountService.getAccountById).toHaveBeenCalledTimes(2)
      expect(accountService.getAccountById).toHaveBeenCalledWith("account-111")
      expect(accountService.getAccountById).toHaveBeenCalledWith("account-222")
      expect(result).toEqual({
        reviews: [
          {
            score: 5,
            description: "Excellent!",
            courseName: "Numerology Basics",
            userName: "user1",
            profileUrl: "https://example.com/user1.jpg",
            updatedAt: new Date("2025-02-01"),
          },
          {
            score: 4,
            description: "Good experience",
            courseName: "Numerology Basics",
            userName: "user2",
            profileUrl: "https://example.com/user2.jpg",
            updatedAt: new Date("2025-02-05"),
          },
        ],
      })
    })

    it("should use accountId as userName when account is null", async () => {
      // Arrange
      const mockReviewData = [
        {
          score: 3,
          description: "Average",
          booking: {
            course: {
              courseName: "Crystal Healing",
            },
            customer: {
              accountId: "account-333",
            },
          },
          updatedAt: new Date("2025-02-10"),
        },
      ]

      reviewRepository.findByCourseId.mockResolvedValue(mockReviewData as any)
      accountService.getAccountById.mockResolvedValue(null as any)

      // Act
      const result = await service.getReviewByCourseId(courseId)

      // Assert
      expect(result).toEqual({
        reviews: [
          {
            score: 3,
            description: "Average",
            courseName: "Crystal Healing",
            userName: "account-333",
            profileUrl: "",
            updatedAt: new Date("2025-02-10"),
          },
        ],
      })
    })

    it("should use accountId as userName when account is undefined", async () => {
      // Arrange
      const mockReviewData = [
        {
          score: 2,
          description: "Below expectations",
          booking: {
            course: {
              courseName: "Chakra Alignment",
            },
            customer: {
              accountId: "account-444",
            },
          },
          updatedAt: new Date("2025-02-15"),
        },
      ]

      reviewRepository.findByCourseId.mockResolvedValue(mockReviewData as any)
      accountService.getAccountById.mockResolvedValue(undefined as any)

      // Act
      const result = await service.getReviewByCourseId(courseId)

      // Assert
      expect(result).toEqual({
        reviews: [
          {
            score: 2,
            description: "Below expectations",
            courseName: "Chakra Alignment",
            userName: "account-444",
            profileUrl: "",
            updatedAt: new Date("2025-02-15"),
          },
        ],
      })
    })

    it("should return empty reviews array when course has no reviews", async () => {
      // Arrange
      reviewRepository.findByCourseId.mockResolvedValue([])

      // Act
      const result = await service.getReviewByCourseId(courseId)

      // Assert
      expect(reviewRepository.findByCourseId).toHaveBeenCalledWith(courseId)
      expect(accountService.getAccountById).not.toHaveBeenCalled()
      expect(result).toEqual({ reviews: [] })
    })

    it("should handle reviews with null descriptions", async () => {
      // Arrange
      const mockReviewData = [
        {
          score: 5,
          description: null,
          booking: {
            course: {
              courseName: "Meditation Guide",
            },
            customer: {
              accountId: "account-555",
            },
          },
          updatedAt: new Date("2025-02-20"),
        },
      ]

      const mockAccount = {
        username: "meditator",
        profileUrl: "https://example.com/meditator.jpg",
      }

      reviewRepository.findByCourseId.mockResolvedValue(mockReviewData as any)
      accountService.getAccountById.mockResolvedValue(mockAccount as any)

      // Act
      const result = await service.getReviewByCourseId(courseId)

      // Assert
      expect(result).toEqual({
        reviews: [
          {
            score: 5,
            description: null,
            courseName: "Meditation Guide",
            userName: "meditator",
            profileUrl: "https://example.com/meditator.jpg",
            updatedAt: new Date("2025-02-20"),
          },
        ],
      })
    })

    it("should handle mixed account data (some valid, some null)", async () => {
      // Arrange
      const mockReviewData = [
        {
          score: 5,
          description: "Great!",
          booking: {
            course: {
              courseName: "Feng Shui",
            },
            customer: {
              accountId: "account-666",
            },
          },
          updatedAt: new Date("2025-03-01"),
        },
        {
          score: 4,
          description: "Nice!",
          booking: {
            course: {
              courseName: "Feng Shui",
            },
            customer: {
              accountId: "account-777",
            },
          },
          updatedAt: new Date("2025-03-02"),
        },
        {
          score: 3,
          description: "Ok",
          booking: {
            course: {
              courseName: "Feng Shui",
            },
            customer: {
              accountId: "account-888",
            },
          },
          updatedAt: new Date("2025-03-03"),
        },
      ]

      reviewRepository.findByCourseId.mockResolvedValue(mockReviewData as any)
      accountService.getAccountById
        .mockResolvedValueOnce({
          username: "user6",
          profileUrl: "https://example.com/user6.jpg",
        } as any)
        .mockResolvedValueOnce(null as any)
        .mockResolvedValueOnce(undefined as any)

      // Act
      const result = await service.getReviewByCourseId(courseId)

      // Assert
      expect(result).toEqual({
        reviews: [
          {
            score: 5,
            description: "Great!",
            courseName: "Feng Shui",
            userName: "user6",
            profileUrl: "https://example.com/user6.jpg",
            updatedAt: new Date("2025-03-01"),
          },
          {
            score: 4,
            description: "Nice!",
            courseName: "Feng Shui",
            userName: "account-777",
            profileUrl: "",
            updatedAt: new Date("2025-03-02"),
          },
          {
            score: 3,
            description: "Ok",
            courseName: "Feng Shui",
            userName: "account-888",
            profileUrl: "",
            updatedAt: new Date("2025-03-03"),
          },
        ],
      })
    })
  })

  describe("createReview", () => {
    it("should create a review successfully", async () => {
      // Arrange
      const createReviewDto: CreateReviewReqDto = {
        accountId: "account-999",
        bookingId: "booking-123",
        courseId: "course-456",
        score: 5,
        description: "Amazing experience!",
      }

      const mockCustomer = {
        id: "customer-789",
      }

      const mockCreatedReview = {
        id: "review-001",
        customerId: "customer-789",
        score: 5,
        description: "Amazing experience!",
        bookingId: "booking-123",
        createdAt: new Date("2025-03-10"),
        updatedAt: new Date("2025-03-10"),
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )
      reviewRepository.create.mockResolvedValue(mockCreatedReview as any)

      // Act
      const result = await service.createReview(createReviewDto)

      // Assert
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        "account-999"
      )
      expect(reviewRepository.create).toHaveBeenCalledWith({
        customerId: "customer-789",
        score: 5,
        description: "Amazing experience!",
        bookingId: "booking-123",
      })
      expect(result).toEqual(mockCreatedReview)
    })

    it("should create a review with null description", async () => {
      // Arrange
      const createReviewDto: CreateReviewReqDto = {
        accountId: "account-1001",
        bookingId: "booking-456",
        courseId: "course-789",
        score: 4,
        description: undefined as any,
      }

      const mockCustomer = {
        id: "customer-1001",
      }

      const mockCreatedReview = {
        id: "review-002",
        customerId: "customer-1001",
        score: 4,
        description: null,
        bookingId: "booking-456",
        createdAt: new Date("2025-03-11"),
        updatedAt: new Date("2025-03-11"),
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )
      reviewRepository.create.mockResolvedValue(mockCreatedReview as any)

      // Act
      const result = await service.createReview(createReviewDto)

      // Assert
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        "account-1001"
      )
      expect(reviewRepository.create).toHaveBeenCalledWith({
        customerId: "customer-1001",
        score: 4,
        description: undefined,
        bookingId: "booking-456",
      })
      expect(result).toEqual(mockCreatedReview)
    })

    it("should throw NotFoundException when customer is null", async () => {
      // Arrange
      const createReviewDto: CreateReviewReqDto = {
        accountId: "account-nonexistent",
        bookingId: "booking-789",
        courseId: "course-101",
        score: 3,
        description: "Test review",
      }

      customerService.getCustomerByAccountId.mockResolvedValue(null as any)

      // Act & Assert
      await expect(service.createReview(createReviewDto)).rejects.toThrow(
        NotFoundException
      )
      await expect(service.createReview(createReviewDto)).rejects.toThrow(
        "Customer not found"
      )
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        "account-nonexistent"
      )
      expect(reviewRepository.create).not.toHaveBeenCalled()
    })

    it("should throw NotFoundException when customer id is undefined", async () => {
      // Arrange
      const createReviewDto: CreateReviewReqDto = {
        accountId: "account-invalid",
        bookingId: "booking-999",
        courseId: "course-202",
        score: 2,
        description: "Not satisfied",
      }

      const mockCustomer = {
        id: undefined,
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )

      // Act & Assert
      await expect(service.createReview(createReviewDto)).rejects.toThrow(
        NotFoundException
      )
      await expect(service.createReview(createReviewDto)).rejects.toThrow(
        "Customer not found"
      )
      expect(customerService.getCustomerByAccountId).toHaveBeenCalledWith(
        "account-invalid"
      )
      expect(reviewRepository.create).not.toHaveBeenCalled()
    })

    it("should handle all score values correctly", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-score-test",
      }

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )

      const scores = [1, 2, 3, 4, 5]

      for (const score of scores) {
        const createReviewDto: CreateReviewReqDto = {
          accountId: "account-score-test",
          bookingId: `booking-${score}`,
          courseId: "course-score-test",
          score: score,
          description: `Score ${score} review`,
        }

        const mockCreatedReview = {
          id: `review-${score}`,
          customerId: "customer-score-test",
          score: score,
          description: `Score ${score} review`,
          bookingId: `booking-${score}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        reviewRepository.create.mockResolvedValue(mockCreatedReview as any)

        // Act
        const result = await service.createReview(createReviewDto)

        // Assert
        expect(result.score).toBe(score)
        expect(reviewRepository.create).toHaveBeenCalledWith({
          customerId: "customer-score-test",
          score: score,
          description: `Score ${score} review`,
          bookingId: `booking-${score}`,
        })
      }

      expect(customerService.getCustomerByAccountId).toHaveBeenCalledTimes(5)
      expect(reviewRepository.create).toHaveBeenCalledTimes(5)
    })
  })

  describe("Edge Cases and Integration", () => {
    it("should handle concurrent calls to getReviewByCourseId", async () => {
      // Arrange
      const courseId1 = "course-concurrent-1"
      const courseId2 = "course-concurrent-2"

      const mockReviewData1 = [
        {
          score: 5,
          description: "Course 1 review",
          booking: {
            course: { courseName: "Course 1" },
            customer: { accountId: "account-c1" },
          },
          updatedAt: new Date(),
        },
      ]

      const mockReviewData2 = [
        {
          score: 4,
          description: "Course 2 review",
          booking: {
            course: { courseName: "Course 2" },
            customer: { accountId: "account-c2" },
          },
          updatedAt: new Date(),
        },
      ]

      reviewRepository.findByCourseId
        .mockResolvedValueOnce(mockReviewData1 as any)
        .mockResolvedValueOnce(mockReviewData2 as any)

      accountService.getAccountById.mockResolvedValue({
        username: "testuser",
        profileUrl: "http://test.com/profile.jpg",
      } as any)

      // Act
      const [result1, result2] = await Promise.all([
        service.getReviewByCourseId(courseId1),
        service.getReviewByCourseId(courseId2),
      ])

      // Assert
      expect(result1.reviews).toHaveLength(1)
      expect(result2.reviews).toHaveLength(1)
      expect(result1.reviews[0].description).toBe("Course 1 review")
      expect(result2.reviews[0].description).toBe("Course 2 review")
    })

    it("should properly map data when review has empty string description", async () => {
      // Arrange
      const accountId = "account-empty-desc"
      const mockCustomer = {
        id: "customer-empty-desc",
        isPublic: true,
      }

      const mockReviewData = [
        {
          score: 5,
          description: "",
          booking: {
            course: { courseName: "Test Course" },
          },
          updatedAt: new Date("2025-03-15"),
        },
      ]

      customerService.getCustomerByAccountId.mockResolvedValue(
        mockCustomer as any
      )
      reviewRepository.findByCustomerId.mockResolvedValue(mockReviewData as any)

      // Act
      const result = await service.getReviewByAccountId(accountId)

      // Assert
      expect(result.reviews[0].description).toBe("")
    })
  })
})
