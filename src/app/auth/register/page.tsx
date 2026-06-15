import { RegisterForm } from "./RegisterForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton, TextLinkButton } from "@/components/ui";

export default function RegisterPage() {
  return (
    <PageContainer>
      <Header title="新規登録" left={<BackButton />} />
      <ContentContainer>
        <div className="max-w-md mx-auto py-8">
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              すでにアカウントをお持ちの方は
              <TextLinkButton href="/auth/login">ログイン</TextLinkButton>
            </p>
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
