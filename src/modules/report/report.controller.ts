import { Controller, Get, Param } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { ReportService } from "./report.service"
import { ReportDto, GetReportsResponseDto } from "./dto/get-report.dto"

@ApiTags("report")
@Controller("report")
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get()
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  getAll(): Promise<GetReportsResponseDto> {
    return this.service.getAllReports()
  }

  @Get(":id")
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  getById(@Param("id") id: string): Promise<ReportDto> {
    return this.service.getReportById(id)
  }

  @Get("me")
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  get(): Promise<GetReportsResponseDto> {
    const tmpcustomerId = "3ad80e2e4bdc4b7a"
    return this.service.getReportByAccountId(tmpcustomerId)
  }

  @Get("account/:id")
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  getByAccountId(@Param("id") id: string): Promise<GetReportsResponseDto> {
    return this.service.getReportByAccountId(id)
  }

  @Get("customer/:id")
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  getByCustomerId(@Param("id") id: string): Promise<GetReportsResponseDto> {
    return this.service.getReportByCustomerId(id)
  }

  @Get("admin/:id")
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  getByAdminId(@Param("id") id: string): Promise<GetReportsResponseDto> {
    return this.service.getReportByAccountId(id)
  }
}
