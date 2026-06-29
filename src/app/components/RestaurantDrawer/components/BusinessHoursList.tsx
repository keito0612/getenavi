import type { BusinessHourData } from "@/lib/types";
import { Section, Stack, FlexRow } from "@/components/ui/containers";
import { DAY_OF_WEEK } from "@/lib/types";

type Props = {
  hours: BusinessHourData[];
};

export function BusinessHoursList({ hours }: Props) {
  return (
    <Section label="営業時間">
      <Stack gap="sm">
        {hours.map((hour) => (
          <HourRow key={hour.id} hour={hour} />
        ))}
      </Stack>
    </Section>
  );
}

function HourRow({ hour }: { hour: BusinessHourData }) {
  const dayName = DAY_OF_WEEK[hour.dayOfWeek as keyof typeof DAY_OF_WEEK];

  return (
    <FlexRow className="text-sm">
      <span className="w-16 text-gray-600">{dayName}</span>
      <span className="text-gray-900">
        {hour.isClosed ? (
          <span className="text-red-500 font-medium">定休日</span>
        ) : (
          `${hour.openTime} - ${hour.closeTime}`
        )}
      </span>
    </FlexRow>
  );
}
