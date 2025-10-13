import { Controller, Get, Param, Patch } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { ApiBearerAuth, ApiTags, ApiOkResponse } from "@nestjs/swagger"
import { PublicResponseDto } from "./dto/public-response.dto"
import { Public } from "@/common/decorators/public.decorator"

@ApiTags("customer")
@Controller("customer")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}
  @Patch("toggle-public")
  @ApiBearerAuth()
  @ApiOkResponse({ type: PublicResponseDto })
  togglePublic(@CurrentUser("id") id: string) {
    return this.service.togglePublic(id)
  }

  @Get("public-status/:id")
  @Public()
  @ApiOkResponse({ type: PublicResponseDto })
  getPublicStatus(@Param("id") id: string): Promise<PublicResponseDto> {
    return this.service.getPublicStatus(id)
  }
}
