import { RegisterForm } from "./RegisterForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton } from "@/components/ui";
import Link from "next/link";

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
              <Link href="/auth/login" className="text-orange-500 hover:underline ml-1">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
