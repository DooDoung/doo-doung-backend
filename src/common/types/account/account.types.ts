import { Role } from "@prisma/client"
export type Account = {
  id: string
  username: string
  passwordHash: string
  email: string
  role: Role
}
