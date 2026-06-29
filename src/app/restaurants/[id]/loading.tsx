import { PageContainer, ContentContainer, Stack, CardContainer, FlexRow } from "@/components/ui/containers";
import { Header, BackButton, Skeleton, SkeletonText } from "@/components/ui";

export default function Loading() {
  return (
    <PageContainer className="pt-14 lg:pt-16">
      <Header title="" left={<BackButton />} />
      <HeroSkeleton />
      <ContentContainer padding="lg">
        <Stack gap="lg">
          <BasicInfoSkeleton />
          <DangerLevelSkeleton />
          <TagsSkeleton />
          <DescriptionSkeleton />
          <BusinessHoursSkeleton />
          <ButtonsSkeleton />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}

function HeroSkeleton() {
  return <Skeleton className="w-full h-64 rounded-none" />;
}

function BasicInfoSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton className="h-8 w-3/4" />
      <SkeletonText className="w-1/2" />
    </Stack>
  );
}

function DangerLevelSkeleton() {
  return (
    <CardContainer className="p-4">
      <FlexRow gap="lg">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-32" />
      </FlexRow>
    </CardContainer>
  );
}

function TagsSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton className="h-4 w-16" />
      <FlexRow gap="md">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </FlexRow>
    </Stack>
  );
}

function DescriptionSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton className="h-4 w-16" />
      <CardContainer className="p-4">
        <Stack gap="sm">
          <SkeletonText className="w-full" />
          <SkeletonText className="w-5/6" />
          <SkeletonText className="w-4/6" />
        </Stack>
      </CardContainer>
    </Stack>
  );
}

function BusinessHoursSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton className="h-4 w-16" />
      <CardContainer>
        {[...Array(7)].map((_, i) => (
          <FlexRow key={i} align="between" className="px-4 py-2.5 border-b last:border-b-0">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </FlexRow>
        ))}
      </CardContainer>
    </Stack>
  );
}

function ButtonsSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
    </Stack>
  );
}
