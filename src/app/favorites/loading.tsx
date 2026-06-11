import { PageContainer, ContentContainer, Stack } from "@/components/ui/containers";
import { Header, BackButton, CardSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <PageContainer>
      <Header title="お気に入り" left={<BackButton />} />
      <ContentContainer>
        <Stack gap="sm">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} showRemoveButton />
          ))}
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}
