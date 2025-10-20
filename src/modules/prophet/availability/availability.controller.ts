import {
  UseInterceptors,
  Controller,
  Get,
  Patch,
  Body,
  Param,
} from "@nestjs/common"
import { AvailabilityService } from "./availability.service"
import { PatchAvailabilityDto } from "./dto/patch-availability.dto"
import { AvailabilityFormatInterceptor } from "./availability.interceptor"
import { CurrentUser } from "@/common/decorators/current-user.decorator"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("prophet availability")
@Controller("prophet/availability")
@UseInterceptors(AvailabilityFormatInterceptor)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get("")
  async getMyAvailability(@CurrentUser("id") id: string) {
    return this.availabilityService.getMyAvailability(id)
  }

  @Get(":courseId")
  async getAvailabilityByCourseId(@Param("courseId") courseId: string) {
    return this.availabilityService.getAvailabilityByCourseId(courseId)
  }

  @Patch("")
  async patchMyAvailability(
    @Body() dto: PatchAvailabilityDto,
    @CurrentUser("id") id: string
  ) {
    return this.availabilityService.patchMyAvailability(dto, id)
  }
}
