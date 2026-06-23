import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { WelcomeEmail } from "@/lib/email/templates/WelcomeEmail";
import { PasswordResetEmail } from "@/lib/email/templates/PasswordResetEmail";

export type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
});

export class EmailService {
  private static readonly APP_NAME = "ゲテナビ";
  private static readonly APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  private static readonly MAIL_FROM = process.env.MAIL_FROM || "noreply@getenavi.local";

  /**
   * メール送信
   */
  private static async send(email: EmailTemplate): Promise<void> {
    await transporter.sendMail({
      from: this.MAIL_FROM,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
  }

  /**
   * 新規登録完了メール
   */
  static async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = `【${this.APP_NAME}】ご登録ありがとうございます`;
    const loginUrl = `${this.APP_URL}/auth/login`;
    const html = await render(
      WelcomeEmail({
        name,
        loginUrl,
        appName: this.APP_NAME,
        appUrl: this.APP_URL,
      })
    );
    await this.send({ to, subject, html });
  }

  /**
   * パスワードリセットメール
   */
  static async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.APP_URL}/auth/reset-password?token=${resetToken}`;
    const subject = `【${this.APP_NAME}】パスワード再設定のご案内`;
    const html = await render(
      PasswordResetEmail({
        resetUrl,
        appName: this.APP_NAME,
        appUrl: this.APP_URL,
      })
    );
    await this.send({ to, subject, html });
  }
}
