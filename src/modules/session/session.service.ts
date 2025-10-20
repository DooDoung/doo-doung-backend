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

      // customer info
      customerName: s.customer?.account?.userDetail
        ? `${s.customer.account.userDetail.name} ${s.customer.account.userDetail.lastname}`
        : null,
      customerProfileUrl: s.customer?.account?.userDetail?.profileUrl || null,

      // course info
      courseName: s.course?.courseName || null,
      horoscopeMethodName: s.course?.horoscopeMethod?.name || null,

      // transaction info
      amount: s.transaction?.amount ? Number(s.transaction.amount) : null,

      // review info
      reviewScore: s.reviews[0]?.score || null,
      reviewDescription: s.reviews[0]?.description || null,

      // prophet info
      prophetUsername: s.prophet?.account?.username || null,
      prophetProfileUrl: s.prophet?.account?.userDetail?.profileUrl || null,
    }))
  }

  async getSessionDetailById(sessionId: string) {
    const session = await this.sessionRepository.findById(sessionId)

    if (!session)
      throw new NotFoundException(`Session with ID ${sessionId} not found`)

    const defaultTxAccount = session.prophet.txAccounts[0]

    return {
      sessionId: session.id,
      courseName: session.course.courseName,
      horoscopeMethod: session.course.horoscopeMethod?.name || "",
      horoscopeSector: session.course.horoscopeSector,
      startDateTime: session.startDateTime,
      endDateTime: session.endDateTime,
      prophetName: session.prophet.account.userDetail
        ? `${session.prophet.account.userDetail.name} ${session.prophet.account.userDetail.lastname}`
        : session.prophet.account.username,
      prophetUsername: session.prophet.account.username,
      prophetProfileUrl: session.prophet.account.userDetail?.profileUrl || null,
      transactionId: session.transaction?.id || "",
      amount: session.transaction?.amount?.toNumber() || 0,
      payoutStatus: session.transaction?.status || "PENDING_PAYOUT",
      transactionCreatedAt: session.transaction?.createdAt || new Date(),
      customerName: session.customer.account.userDetail
        ? `${session.customer.account.userDetail.name} ${session.customer.account.userDetail.lastname}`
        : session.customer.account.username,
      customerUsername: session.customer.account.username,
      txAccountName: defaultTxAccount?.accountName || null,
      txBank: defaultTxAccount?.bank || null,
      txAccountNumber: defaultTxAccount?.accountNumber || null,
    }
  }
}
