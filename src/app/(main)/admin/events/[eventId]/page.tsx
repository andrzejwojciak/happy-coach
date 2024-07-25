import { getEventByIdAction } from "@/src/lib/actions/eventsActions";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default async function EventDetails({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEventByIdAction(Number(params.eventId));

  if (!event) return <p>Event {params.eventId} not found :\</p>;

  return (
    <div
      style={{
        backgroundColor: "lightgray",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <h2 style={{ color: "blue" }}>Event Info</h2>
      <p>id: {event.id}</p>
      <p>channelId: {event.channelId}</p>
      <p>pointsForHour: {event.pointsForHour}</p>
      <p>pointsForKilometer: {event.pointsForKilometer}</p>
      <div>
        <Link
          href="/admin/events"
          className="w-auto p-2 rounded-lg flex items-center"
        >
          <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
          Back
        </Link>
      </div>
    </div>
  );
}
