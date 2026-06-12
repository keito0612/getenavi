import nodemailer from "nodemailer";

export type EmailTemplate = {
  to: string;
  subject: string;
  body: string;
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
  static async send(email: EmailTemplate): Promise<void> {
    await transporter.sendMail({
      from: this.MAIL_FROM,
      to: email.to,
      subject: email.subject,
      text: email.body,
    });
  }

  /**
   * 新規登録完了メール
   */
  static async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = `【${this.APP_NAME}】ご登録ありがとうございます`;
    const body = `
${name} 様

${this.APP_NAME} へのご登録ありがとうございます。

    アカウントの登録が完了しました。
    以下のリンクからログインして、珍しい食材を扱う飲食店を探してみましょう！

${this.APP_URL}/auth/login

────────────────────────────────
${this.APP_NAME}
${this.APP_URL}
────────────────────────────────
※このメールに心当たりがない場合は、お手数ですが削除してください。
    `.trim();

    await this.send({
      to,
      subject: subject,
      body: body
    });
  }

  /**
   * パスワードリセットメール
   */
  static async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.APP_URL}/auth/reset-password?token=${resetToken}`;
    const subject = `【${this.APP_NAME}】パスワード再設定のご案内`;
    const body = `パスワード再設定のリクエストを受け付けました。

    以下のリンクから新しいパスワードを設定してください。
    このリンクは1時間後に無効になります。

${resetUrl}

────────────────────────────────
${this.APP_NAME}
${this.APP_URL}
────────────────────────────────
※このメールに心当たりがない場合は、お手数ですが削除してください。
    `.trim();

    await this.send({
      to,
      subject: subject,
      body: body
    });
  }
}
