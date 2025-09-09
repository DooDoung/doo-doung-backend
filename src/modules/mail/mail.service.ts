import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as Brevo from "@getbrevo/brevo"

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly emailApi: Brevo.TransactionalEmailsApi

  constructor(private readonly config: ConfigService) {
    // init Brevo SDK
    this.emailApi = new Brevo.TransactionalEmailsApi()
    const apiKey = this.config.get<string>("mail.apiKey")
    if (!apiKey) {
      this.logger.error("BREVO_API_KEY missing")
      throw new Error("BREVO_API_KEY missing")
    }
    // Set API key
    ;(this.emailApi as any).authentications = { apiKey: { apiKey } }
  }

  async sendPasswordReset(toEmail: string, token: string): Promise<void> {
    const fromEmail = this.config.get<string>("mail.fromEmail")!
    const fromName = this.config.get<string>("mail.fromName")!
    const baseUrl = this.config.get<string>("app.frontendBaseUrl")!

    // https://doodoung.com/reset-password?token=...
    const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`

    const msg = new Brevo.SendSmtpEmail()
    msg.sender = { email: fromEmail, name: fromName }
    msg.to = [{ email: toEmail }]
    msg.subject = "Password Reset Request"
    msg.textContent = `We received a request to reset your password.`

    msg.htmlContent = `<p><a href="${resetUrl}" target="_blank" rel="noopener">Reset your password</a></p>
    <p>This link expires in <strong>15 minutes</strong>. If you didn't request this, you can ignore this email.</p>`

    try {
      await this.emailApi.sendTransacEmail(msg)
    } catch (err) {
      // Log only metadata
      this.logger.error(
        `Failed to send reset email to ${toEmail}`,
        err || String(err)
      )
      throw err
    }
  }
}
