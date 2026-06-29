import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Header, BackButton } from "@/components/ui";

export default function ResetPasswordPage() {
  return (
    <PageContainer className="pt-14 lg:pt-16">
      <Header title="新しいパスワードを設定" left={<BackButton />} />
      <ContentContainer>
        <div className="max-w-md mx-auto py-8">
          <Suspense fallback={<div>読み込み中...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
