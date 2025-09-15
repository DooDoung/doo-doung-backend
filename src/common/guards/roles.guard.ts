import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator"
import { ROLES_KEY } from "../decorators/roles.decorator"
import { Role } from "@prisma/client"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])
    if (isPublic) return true

    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])
    if (!required || required.length === 0) return true

    const { user } = ctx.switchToHttp().getRequest()
    if (!user?.role) throw new ForbiddenException("Missing role on user")
    const isAuthorizedRole = required.includes(user.role)
    if (!isAuthorizedRole)
      throw new ForbiddenException(
        "This role is not authorized for this action"
      )
    return true
  }
}
