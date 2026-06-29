import type { BusinessHourData } from "@/lib/types";
import { Section, CardContainer, FlexRow } from "@/components/ui/containers";
import { DAY_OF_WEEK } from "@/lib/types";

type Props = {
  hours: BusinessHourData[];
};

export function BusinessHoursCard({ hours }: Props) {
  return (
    <Section label="営業時間">
      <CardContainer>
        {hours.map((hour) => (
          <HourRow key={hour.id} hour={hour} />
        ))}
      </CardContainer>
    </Section>
  );
}

function HourRow({ hour }: { hour: BusinessHourData }) {
  const dayName = DAY_OF_WEEK[hour.dayOfWeek as keyof typeof DAY_OF_WEEK];

  return (
    <FlexRow align="between" className="px-4 py-2.5 border-b last:border-b-0">
      <span className="text-gray-600">{dayName}</span>
      {hour.isClosed ? (
        <span className="text-red-500 font-medium">定休日</span>
      ) : (
        <span className="text-gray-900">{hour.openTime} - {hour.closeTime}</span>
      )}
    </FlexRow>
  );
}
