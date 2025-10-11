import { Controller, Patch } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"

@ApiTags("customer")
@Controller("customer")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}
  @Patch("toggle-public")
  @ApiBearerAuth()
  togglePublic(@CurrentUser("id") id: string) {
    return this.service.togglePublic(id)
  }
}
