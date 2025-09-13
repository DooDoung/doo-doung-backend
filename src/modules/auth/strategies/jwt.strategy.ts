import { Injectable } from "@nestjs/common"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { ConfigService } from "@nestjs/config"
import { JwtPayload } from "@/modules/auth/type/jwt-payload.type"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("jwt.secret"),
    })
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    }
  }
}
