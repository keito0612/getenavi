import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton } from "@/components/ui";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <PageContainer>
      <Header title="パスワード再設定" left={<BackButton />} />
      <ContentContainer>
        <div className="max-w-md mx-auto py-8">
          <p className="text-sm text-gray-600 mb-6">
            登録したメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
          </p>
          <ForgotPasswordForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/auth/login" className="text-orange-500 hover:underline">
              ログインに戻る
            </Link>
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
