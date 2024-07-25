import EditEventForm from "@/src/components/admin/events/edit-event";
import { getEventById } from "@/src/lib/services/eventsService";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default async function EditEvent({
  params,
}: {
  params: { eventId: number };
}) {
  const event = await getEventById(Number(params.eventId));

  if (!event) return <p>Event {params.eventId} not found :\</p>;

  return (
    <>
      <EditEventForm event={event} />
    </>
  );
}
