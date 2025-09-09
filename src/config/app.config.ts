import { registerAs } from "@nestjs/config"

export default registerAs("app", () => ({
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || "https://localhost:3000",
}))
