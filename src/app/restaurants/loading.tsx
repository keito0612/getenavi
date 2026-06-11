import { PageContainer, ContentContainer, Stack, FlexRow } from "@/components/ui/containers";
import { Header, BackButton, Skeleton, CardSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <PageContainer>
      <Header title="店舗一覧" left={<BackButton />} />
      <ContentContainer>
        <Stack>
          <SearchBarSkeleton />
          <TagFilterSkeleton />
          <ListSkeleton />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}

function SearchBarSkeleton() {
  return <Skeleton className="h-12 w-full rounded-xl" />;
}

function TagFilterSkeleton() {
  return (
    <FlexRow gap="md" className="overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
      ))}
    </FlexRow>
  );
}

function ListSkeleton() {
  return (
    <Stack gap="sm">
      {[...Array(5)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </Stack>
  );
}
