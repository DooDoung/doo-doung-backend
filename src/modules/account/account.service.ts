import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { AccountRepository } from "./account.repository"
import { Role, Sex , ZodiacSign} from "@prisma/client"
import { CustomerAccount, MeResponse, ProphetAccount } from "./interface/get-account.interface"
import { CustomerService } from "../customer/customer.service"
import { ProphetService } from "../prophet/prophet.service"

@Injectable()
export class AccountService {
  constructor(
    private readonly repo: AccountRepository,
    private readonly customerService: CustomerService,
    private readonly prophetService: ProphetService
  ) {}

  async getMyAccount(): Promise<MeResponse> {
    const tmpAccountId = "01f580f4e5ab4d0f"
    const account = await this.repo.findBaseById(tmpAccountId, {
      username: true,
      email: true,
      role: true,
      userDetail: { select: { phoneNumber: true, gender: true } },
    })
    if (!account) throw new NotFoundException("Account not found")

    const base = {
      username: account.username,
      email: account.email,
      phoneNumber: account.userDetail?.phoneNumber ?? null,
      gender: account.userDetail?.gender ?? null,
    }

    if (account.role === Role.CUSTOMER) {
      const customer =
        await this.customerService.getDetailByAccountId(tmpAccountId)
      return { ...base, role: Role.CUSTOMER, ...customer }
    }

    if (account.role === Role.PROPHET) {
      const prophet =
        await this.prophetService.getDetailByAccountId(tmpAccountId)
      return { ...base, role: Role.PROPHET, ...prophet }
    }

    throw new NotFoundException("Role not found")
  }
  async createAccount(role : Role, dto : any){
    if (role === Role.CUSTOMER) 
    {
      dto = dto as CustomerAccount
      const id = await this.repo.createBase(dto.username, dto.email, dto.passwordHash, Role.CUSTOMER, {name : dto.name, lastname : dto.lastname, phoneNumber : dto.phoneNumber, gender : dto.sex});
      await this.customerService.createDetail(id, {zodiacSign : dto.zodiacSign, birthDate : dto.birthDate, birthTime : dto.birthTime});
      return id;
    
    } else if (role === Role.PROPHET) {
      dto = dto as ProphetAccount
      const id = await this.repo.createBase(dto.username, dto.email, dto.passwordHash, Role.PROPHET, {name : dto.name, lastname : dto.lastname, phoneNumber : dto.phoneNumber, gender : dto.sex});
      await this.prophetService.createProphetDetail(id, {txAccounts : dto.txAccounts ?? [], lineId : dto.lineId});
      return id;
    }
    else throw new NotFoundException("Role not found")
  }
}
