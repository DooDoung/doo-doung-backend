import { Role } from "@prisma/client"

export type JwtUser = {
  id: string
  username: string
  email: string
  role: Role
}
