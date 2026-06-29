import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton, TextLinkButton } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <PageContainer className="pt-14 lg:pt-16">
      <Header title="パスワード再設定" left={<BackButton />} />
      <ContentContainer>
        <div className="max-w-md mx-auto py-8">
          <p className="text-sm text-gray-600 mb-6">
            登録したメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
          </p>
          <ForgotPasswordForm />
          <TextLinkButton href="/auth/login" type="centered">
            ログインに戻る
          </TextLinkButton>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
