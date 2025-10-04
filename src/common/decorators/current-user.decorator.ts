import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { JwtUser } from "../types/auth/jwt-user.type"

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    const user = req.user as JwtUser
    return data ? user?.[data] : user
  }
)
