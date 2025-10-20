import { Injectable, NotFoundException } from "@nestjs/common"
import { SessionRepository } from "./session.repository"
// import { CustomerService } from "../customer/customer.service"
// import { AccountService } from "../account/account.service"
// import { SessionDto, GetSessionsResponseDto } from "./dto/get-session.dto"
// import { Role } from "@prisma/client"

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async getSessionsByProphetId(prophetId: string) {
    const sessions = await this.sessionRepository.findAllByProphetId(prophetId)
    if (!sessions.length) {
      throw new NotFoundException(`No sessions found for prophet ${prophetId}`)
    }
    return sessions.map(s => ({
      id: s.id,
      customerId: s.customerId,
      courseId: s.courseId,
      prophetId: s.prophetId,
      status: s.status,
      startDateTime: s.startDateTime,
      endDateTime: s.endDateTime,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,

      // optional mapped fields
      customerName: s.customer?.account?.userDetail
        ? `${s.customer.account.userDetail.name} ${s.customer.account.userDetail.lastname}`
        : null,
      customerProfileUrl: s.customer?.account?.userDetail?.profileUrl || null,
      courseName: s.course?.courseName || null,
      horoscopeMethodName: s.course?.horoscopeMethod?.name || null,
      amount: s.transaction?.amount ? Number(s.transaction.amount) : null,
      reviewScore: s.reviews[0]?.score || null,
      reviewDescription: s.reviews[0]?.description || null,
    }))
  }
}
