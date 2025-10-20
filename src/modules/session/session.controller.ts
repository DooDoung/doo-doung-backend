import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import {
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { SessionService } from "./session.service"
import { SessionDetailDto } from "./dto/get-session.dto"
import { CurrentUser } from "@/common/decorators/current-user.decorator"

@ApiTags("session")
@Controller("session")
export class SessionController {
  constructor(private readonly service: SessionService) {}

  @Get("prophet")
  @ApiBearerAuth()
  @ApiOkResponse({ type: [SessionDetailDto] })
  getSessions(
    @CurrentUser("id") id: string,
    @Param("prophetId") prophetId: string
  ) {
    return this.service.getSessionsByUserId(id)
  }

  @Get("/prophet/:sessionId")
  @ApiBearerAuth()
  @ApiParam({
    name: "sessionId",
    description: "Session ID",
    example: "bk_1234567890abcd",
  })
  @ApiOkResponse({ type: SessionDetailDto })
  @ApiNotFoundResponse({ description: "Session not found" })
  getSessionById(@Param("sessionId") sessionId: string) {
    return this.service.getSessionDetailById(sessionId)
  }
}
