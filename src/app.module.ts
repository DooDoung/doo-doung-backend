import { Module } from "@nestjs/common"
import { PrismaModule } from "./db/prisma.module"
import { AccountModule } from "./modules/account/account.module"

@Module({
  imports: [PrismaModule, AccountModule],
})
export class AppModule {}
