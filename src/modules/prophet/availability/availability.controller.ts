import { Controller, Get, Patch, Body } from "@nestjs/common"
import { AvailabilityService } from "./availability.service"
import { PatchAvailabilityDto } from "./dto/patch-availability.dto"

@Controller("prophet/availability")
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
