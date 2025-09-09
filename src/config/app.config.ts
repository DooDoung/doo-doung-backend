import { registerAs } from "@nestjs/config"

export default registerAs("app", () => ({
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || "http://localhost:3000",
}))
