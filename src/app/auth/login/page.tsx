import { LoginForm } from "./LoginForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton, TextLinkButton } from "@/components/ui";

export default function LoginPage() {
  return (
    <PageContainer>
      <Header title="ログイン" left={<BackButton />} />
      <ContentContainer>
        <div className="max-w-md mx-auto py-8">
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>
              アカウントをお持ちでない方は
              <TextLinkButton href="/auth/register">新規登録</TextLinkButton>
            </p>
            <p>
              <TextLinkButton href="/auth/forgot-password">
                パスワードをお忘れの方
              </TextLinkButton>
            </p>
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
