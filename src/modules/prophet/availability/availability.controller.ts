import { UseInterceptors, Controller, Get, Patch, Body } from "@nestjs/common"
import { AvailabilityService } from "./availability.service"
import { PatchAvailabilityDto } from "./dto/patch-availability.dto"
import { AvailabilityFormatInterceptor } from "./availability.interceptor"

@Controller("prophet/availability")
@UseInterceptors(AvailabilityFormatInterceptor)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get("")
  async getMyAvailability() {
    return this.availabilityService.getMyAvailability()
  }

  @Patch("")
  async patchMyAvailability(@Body() dto: PatchAvailabilityDto) {
    return this.availabilityService.patchMyAvailability(dto)
  }
}
