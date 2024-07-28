import EventCard from "@/src/components/admin/events/event-card";
import { getEventDetailsByIdAction } from "@/src/lib/actions/eventsActions";

export default async function EventDetails({
  params,
}: {
  params: { eventId: string };
}) {
  const eventDetails = await getEventDetailsByIdAction(Number(params.eventId));

  if (!eventDetails) return <p>Event {params.eventId} not found :\</p>;

  return (
    <>
      <EventCard eventDetails={eventDetails} />
    </>
  );
}
