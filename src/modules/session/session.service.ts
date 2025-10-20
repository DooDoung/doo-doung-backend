import { Injectable, NotFoundException } from "@nestjs/common"
import { SessionRepository } from "./session.repository"
import { ProphetService } from "../prophet/prophet.service"
@Injectable()
export class SessionService {
  constructor(
    private readonly repo: SessionRepository,
    private readonly prophetService: ProphetService
  ) {}

  async getSessionsByUserId(userId: string) {
    const prophet = await this.prophetService.getProphetByAccountId(userId)
    const prophetId = prophet.id
    if (!prophetId) {
      throw new NotFoundException("Prophet not found")
    }
    const sessions = await this.repo.findByProphetId(prophetId)

    return sessions.map(s => {
      const txAccount = s.prophet.txAccounts.find(a => a.isDefault) || null

      return {
        sessionId: s.id,
        courseName: s.course.courseName,
        horoscopeMethod: s.course.horoscopeMethod?.name || "",
        horoscopeSector: s.course.horoscopeSector,
        status: s.status,
        startDateTime: s.startDateTime,
        endDateTime: s.endDateTime,
        prophetName: s.prophet.account.userDetail?.name || "",
        prophetUsername: s.prophet.account.username,
        prophetProfileUrl: s.prophet.account.userDetail?.profileUrl || null,
        transactionId: s.transaction?.id || null,
        amount: s.transaction?.amount?.toNumber() || 0,
        payoutStatus: s.transaction?.status || "PENDING_PAYOUT",
        transactionCreatedAt: s.transaction?.createdAt || s.createdAt,
        customerName: s.customer.account.userDetail?.name || "",
        customerUsername: s.customer.account.username,
        txAccountName: txAccount?.accountName || null,
        txBank: txAccount?.bank || null,
        txAccountNumber: txAccount?.accountNumber || null,
      }
    })
  }

  async getSessionDetailById(sessionId: string) {
    const session = await this.repo.findById(sessionId)

    if (!session)
      throw new NotFoundException(`Session with ID ${sessionId} not found`)

    const defaultTxAccount = session.prophet.txAccounts[0]

    return {
      sessionId: session.id,
      courseName: session.course.courseName,
      horoscopeMethod: session.course.horoscopeMethod?.name || "",
      horoscopeSector: session.course.horoscopeSector,
      status: session.status,
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
