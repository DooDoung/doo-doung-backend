import { Module } from "@nestjs/common"
import { ProphetService } from "./prophet.service"
import { ProphetRepository } from "./prophet.repository"
<<<<<<< HEAD
import { PrismaService } from "@/db/prisma.service"
=======
import { PrismaService } from "../../db/prisma.service"
>>>>>>> a10f17d (add: create get my account logic)

@Module({
  providers: [ProphetService, ProphetRepository, PrismaService],
  exports: [ProphetService],
})
export class ProphetModule {}
