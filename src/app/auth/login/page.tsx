import { LoginForm } from "./LoginForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton } from "@/components/ui";
import Link from "next/link";

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
              <Link href="/auth/register" className="text-orange-500 hover:underline ml-1">
                新規登録
              </Link>
            </p>
            <p>
              <Link href="/auth/forgot-password" className="text-orange-500 hover:underline">
                パスワードをお忘れの方
              </Link>
            </p>
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
