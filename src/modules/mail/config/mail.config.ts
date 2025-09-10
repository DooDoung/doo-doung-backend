import { registerAs } from "@nestjs/config"

export default registerAs("mail", () => ({
  apiKey: process.env.BREVO_API_KEY!,
  fromEmail: process.env.MAIL_FROM_EMAIL!, // 'doodoung@gmail.com'
  fromName: process.env.MAIL_FROM_NAME || "Doodoung",
}))
