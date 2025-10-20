import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { SessionService } from "./session.service"
import { GetSessionsResponseDto } from "./dto/get-session.dto"

@ApiTags("session")
@Controller("session")
export class SessionController {
  constructor(private readonly service: SessionService) {}

  @UseGuards(JwtAuthGuard)
  @Get("prophet/:prophetId")
  @ApiOkResponse({
    type: GetSessionsResponseDto,
  })
  getSessions(@Param("prophetId") prophetId: string) {
    return this.service.getSessionsByProphetId(prophetId)
  }
}
