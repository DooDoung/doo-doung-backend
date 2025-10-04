import { Injectable, NotFoundException } from "@nestjs/common"
import { ProphetRepository } from "../prophet.repository"
import { PrismaService } from "@/db/prisma.service"
import { PatchAvailabilityDto } from "./dto/patch-availability.dto"

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prophetRepo: ProphetRepository
  ) {}

  // Get current prophet availability
  async getMyAvailability(id: string) {
    const prophet = await this.prophetRepo.findByAccountId(id, {
      id: true,
    })
    if (!prophet) throw new NotFoundException("This user is not a prophet")

    return this.prisma.prophetAvailability.findMany({
      where: { prophetId: prophet.id },
    })
  }

  // Patch current prophet availability
  async patchMyAvailability(dto: PatchAvailabilityDto, id: string) {
    const prophet = await this.prophetRepo.findByAccountId(id, {
      id: true,
    })
    if (!prophet) throw new NotFoundException("This user is not a prophet")

    const adds = []
    const deletes = []

    for (const req of dto.items) {
      if (req.update_type === "add") {
        // create if not exists
        const result = await this.prisma.prophetAvailability.upsert({
          where: {
            prophetId_date_startTime: {
              prophetId: prophet.id,
              date: req.date,
              startTime: req.start_time,
            },
          },
          update: {},
          create: {
            prophetId: prophet.id,
            date: req.date,
            startTime: req.start_time,
          },
        })
        adds.push(result)
      } else if (req.update_type === "delete") {
        // delete if exists
        const result = await this.prisma.prophetAvailability.deleteMany({
          where: {
            prophetId: prophet.id,
            date: req.date,
            startTime: req.start_time,
          },
        })
        deletes.push(result)
      }
    }
    return { add: adds, delete: deletes }
  }
}
