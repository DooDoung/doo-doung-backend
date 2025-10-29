import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common"
import {
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger"
import { ReportService } from "./report.service"
import { ReportDto, GetReportsResponseDto } from "./dto/get-report.dto"
import {
  GetAdminReportsQueryDto,
  GetAdminReportsResponseDto,
  UpdateReportStatusDto,
} from "./dto/admin-report.dto"
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard"
import { CurrentUser } from "@/common/decorators/current-user.decorator"

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetReportsResponseDto,
  })
  getByCurrentUser(
    @CurrentUser("id") id: string
  ): Promise<GetReportsResponseDto> {
    return this.service.getReportByAccountId(id)
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
    return this.service.getReportByAccountId(id)
  }

  @Get("admin/reports")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all reports with filtering and pagination (ADMIN only)",
    description:
      "Sort by creation date (latest first). Filter by status (PENDING by default). Pagination: 15 per page",
  })
  @ApiQuery({
    name: "status",
    enum: ["ALL", "PENDING", "DONE", "DISCARD"],
    isArray: true,
    required: false,
    description:
      "Report status filter. Can be multiple values. Defaults to PENDING",
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page number (1-indexed, default: 1)",
  })
  @ApiOkResponse({
    type: GetAdminReportsResponseDto,
    description: "List of reports with pagination info",
  })
  async getAdminReports(
    @Query() query: GetAdminReportsQueryDto
  ): Promise<GetAdminReportsResponseDto> {
    const statuses = Array.isArray(query.status)
      ? query.status
      : [query.status || "PENDING"]
    return this.service.getAdminReports(statuses, query.page, query.limit)
  }

  @Patch("admin/reports/:reportId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update report status (ADMIN only)",
    description: "Only PENDING reports can be updated to DONE or DISCARD",
  })
  @ApiParam({
    name: "reportId",
    type: String,
    description: "Report ID to update",
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Report ID" },
        reportStatus: { type: "string", enum: ["DONE", "DISCARD"] },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    description: "Updated report status",
  })
  async updateReportStatus(
    @Param("reportId") reportId: string,
    @Body() body: UpdateReportStatusDto,
    @CurrentUser("id") adminId: string
  ): Promise<{ id: string; reportStatus: string; updatedAt: Date }> {
    return this.service.updateReportStatus(reportId, body.reportStatus, adminId)
  }
}
