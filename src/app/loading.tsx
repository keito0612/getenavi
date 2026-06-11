import { PageContainer, ContentContainer } from "@/components/ui/containers";
import { Spinner, HeaderSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <PageContainer>
      <HeaderSkeleton />
      <ContentContainer>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
