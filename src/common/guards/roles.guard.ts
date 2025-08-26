import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(_ctx: ExecutionContext): boolean {
    //implement real logic later
    return true
  }
}
