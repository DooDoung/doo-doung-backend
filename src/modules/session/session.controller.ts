import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard"
import {
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger"
import { SessionService } from "./session.service"
import { GetSessionsResponseDto } from "./dto/get-session.dto"
import { SessionDetailDto } from "./dto/get-session.dto"

@ApiTags("session")
@Controller("session")
export class SessionController {
  constructor(private readonly service: SessionService) {}

  // Get all sessions for a prophet
  @UseGuards(JwtAuthGuard)
  @Get("prophet/:prophetId")
  @ApiOkResponse({ type: GetSessionsResponseDto })
  getSessions(@Param("prophetId") prophetId: string) {
    return this.service.getSessionsByProphetId(prophetId)
  }

  // Get single session by ID with full detail
  @UseGuards(JwtAuthGuard)
  @Get(":sessionId")
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
