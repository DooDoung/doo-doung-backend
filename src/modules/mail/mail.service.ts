// src/modules/mail/mail.service.ts
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as Brevo from "@getbrevo/brevo"
import { passwordResetTemplate } from "./templates/reset-password.template"
@Injectable()
export class MailService {
  private readonly emailApi: Brevo.TransactionalEmailsApi
  private readonly fromEmail: string
  private readonly fromName: string
  private readonly frontendBaseUrl: string

  constructor(private readonly config: ConfigService) {
    this.emailApi = new Brevo.TransactionalEmailsApi()

    const apiKey = this.config.get<string>("mail.apiKey")
    if (!apiKey) throw new Error("BREVO_API_KEY missing")
    this.emailApi.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey)

    this.fromEmail = this.config.get<string>("mail.fromEmail")!
    this.fromName = this.config.get<string>("mail.fromName")!
    this.frontendBaseUrl = this.config.get<string>("app.frontendBaseUrl")!
  }

  async sendPasswordReset(toEmail: string, token: string): Promise<void> {

    // https://doodoung.com/reset-password?token=...
    const resetUrl = this.buildResetUrl(token)

    const msg = new Brevo.SendSmtpEmail()
    msg.sender = { email: this.fromEmail, name: this.fromName }
    msg.to = [{ email: toEmail }]
    msg.subject = "Password Reset Request"
    msg.textContent = `We received a request to reset your password.`

    msg.htmlContent = passwordResetTemplate(resetUrl)
    await this.emailApi.sendTransacEmail(msg)
  }

  private buildResetUrl(token: string): string {
    const baseUrl = this.frontendBaseUrl;
    return `${baseUrl.replace(/\/$/, "")}/reset-password/token?token=${encodeURIComponent(token)}`
  }
}
