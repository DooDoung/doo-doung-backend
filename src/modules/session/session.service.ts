import { Injectable } from "@nestjs/common"
import { SessionRepository } from "./session.repository"

@Injectable()
export class SessionService {
  constructor(private readonly repo: SessionRepository) {}

  async getSessionsByProphetId(prophetId: string) {
    const sessions = await this.repo.findByProphetId(prophetId)

    return sessions.map(s => {
      const txAccount = s.prophet.txAccounts.find(a => a.isDefault) || null

      return {
        sessionId: s.id,
        courseName: s.course.courseName,
        horoscopeMethod: s.course.horoscopeMethod?.name || "",
        horoscopeSector: s.course.horoscopeSector,
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
}
