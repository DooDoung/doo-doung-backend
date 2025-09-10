import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as Brevo from "@getbrevo/brevo"
import { passwordResetTemplate } from "./templates/reset-password.template"
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

    // https://doodoung.com/reset-password?token=...
    const resetUrl = this.buildResetUrl(token);

    const msg = new Brevo.SendSmtpEmail()
    msg.sender = { email: fromEmail, name: fromName }
    msg.to = [{ email: toEmail }]
    msg.subject = "Password Reset Request"
    msg.textContent = `We received a request to reset your password.`

    msg.htmlContent = passwordResetTemplate(resetUrl)
    await this.emailApi.sendTransacEmail(msg)
  }

  private buildResetUrl(token: string): string {
    const baseUrl = this.config.get<string>("app.frontendBaseUrl")!;
    return `${baseUrl.replace(/\/$/, "")}/reset-password/token?token=${encodeURIComponent(token)}`
  }
}
