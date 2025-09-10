// src/config/cors.config.ts
import { registerAs } from "@nestjs/config"

export default registerAs("cors", () => ({
  origins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean),
}))
