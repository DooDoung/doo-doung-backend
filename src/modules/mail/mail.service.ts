import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as Brevo from "@getbrevo/brevo"

@Injectable()
export class MailService {
  private readonly emailApi: Brevo.TransactionalEmailsApi

  constructor(private readonly config: ConfigService) {
    // init Brevo SDK
    this.emailApi = new Brevo.TransactionalEmailsApi()
    const apiKey = this.config.get<string>("mail.apiKey")
    if (!apiKey) {
      throw new Error("BREVO_API_KEY missing")
    }
    // Set API key
    this.emailApi.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey)
  }

  async sendPasswordReset(toEmail: string, token: string): Promise<void> {
    const fromEmail = this.config.get<string>("mail.fromEmail")!
    const fromName = this.config.get<string>("mail.fromName")!
    const baseUrl = this.config.get<string>("app.frontendBaseUrl")!

    // https://doodoung.com/reset-password?token=...
    const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password/token?token=${encodeURIComponent(token)}`

    const msg = new Brevo.SendSmtpEmail()
    msg.sender = { email: fromEmail, name: fromName }
    msg.to = [{ email: toEmail }]
    msg.subject = "Password Reset Request"
    msg.textContent = `We received a request to reset your password.`

    msg.htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #fafafa;">
    <h2 style="color: #333; font-weight: normal; margin-bottom: 16px;">Reset your password</h2>
    <p style="color: #555; margin-bottom: 24px;">
      We received a request to reset your password. Click the button below to continue:
    </p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" target="_blank" rel="noopener"
         style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
         Reset Password
      </a>
    </p>
    <p style="color: #888; font-size: 12px; line-height: 1.4;">
      This link will expire in <strong>15 minutes</strong>.<br>
      If you didn’t request this, you can safely ignore this email.
    </p>
  </div>
`
    await this.emailApi.sendTransacEmail(msg)
  }
}
