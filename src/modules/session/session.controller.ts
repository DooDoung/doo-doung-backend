import { Controller, Get, Param } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { SessionService } from "./session.service"
import { GetSessionsResponseDto } from "./dto/get-session.dto"

@ApiTags("session")
@Controller("session")
export class SessionController {
  constructor(private readonly service: SessionService) {}

  @Get("prophet/:prophetId")
  @ApiOkResponse({
    type: GetSessionsResponseDto,
  })
  getSessions(@Param("prophetId") prophetId: string) {
    return this.service.getSessionsByProphetId(prophetId)
  }
}
