import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetUrl: string;
  appName: string;
  appUrl: string;
}

export function PasswordResetEmail({
  resetUrl,
  appName,
  appUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>パスワード再設定のご案内</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{appName}</Heading>

          <Section style={section}>
            <Text style={text}>パスワード再設定のリクエストを受け付けました。</Text>
            <Text style={text}>
              以下のボタンから新しいパスワードを設定してください。
              <br />
              <span style={warningText}>このリンクは1時間後に無効になります。</span>
            </Text>

            <Link href={resetUrl} style={button}>
              パスワードを再設定する
            </Link>

            <Text style={smallText}>
              ボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：
              <br />
              <Link href={resetUrl} style={linkText}>
                {resetUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              {appName}
              <br />
              <Link href={appUrl} style={footerLink}>
                {appUrl}
              </Link>
            </Text>
            <Text style={footerNote}>
              ※このメールに心当たりがない場合は、お手数ですが削除してください。
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const heading = {
  color: "#d97706",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  padding: "20px 0",
  margin: "0",
};

const section = {
  padding: "24px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const warningText = {
  color: "#dc2626",
  fontWeight: "500" as const,
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "24px",
};

const linkText = {
  color: "#d97706",
  wordBreak: "break-all" as const,
};

const button = {
  backgroundColor: "#d97706",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  marginTop: "16px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  padding: "0 24px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "0",
};

const footerLink = {
  color: "#d97706",
  textDecoration: "none",
};

const footerNote = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "16px",
};

export default PasswordResetEmail;
