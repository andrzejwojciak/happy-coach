import { Event } from "@/src/lib/models/Event";
import { getEvents } from "@/src/lib/actions/eventsActions";
import {
  PlusIcon,
  PencilSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import clsx from "clsx";

export default async function Events() {
  const events: Event[] = await getEvents({ page: 0, perPage: 100 });

  return (
    <div>
      <div className="rounded-t-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-slate-500 text-white text-left">
            <tr>
              <th className="font-normal pl-2 min-w-10">Id</th>
              <th className="font-normal">Name</th>
              <th className="font-normal">Starts at</th>
              <th className="font-normal">Ends at</th>
              <th className="font-normal">Points for h</th>
              <th className="font-normal">Points for km</th>
              <th className="font-normal">Points to score</th>
              <th className="font-normal">Finished</th>
              <th className="font-normal">Theme</th>
              <th className="font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              return (
                <tr
                  key={event.id}
                  className={clsx("", {
                    "bg-slate-100": events.indexOf(event) % 2 !== 0,
                  })}
                >
                  <td className="pl-2">{event.id}</td>
                  <td>{event.eventName}</td>
                  <td>{formatDate(event.createdAt)}</td>
                  <td>{formatDate(event.endsAt ?? new Date())}</td>
                  <td>{event.pointsForHour}</td>
                  <td>{event.pointsForKilometer}</td>
                  <td>{event.totalPointsToScore}</td>
                  <td>{event.finished ? "true" : "false"}</td>
                  <td>
                    {event.theme !== undefined ? (
                      <div>
                        <div>Name: {event.theme?.name}</div>
                        <div>Start: {event.theme?.start}</div>
                        <div>Finish: {event.theme?.finish}</div>
                        <div>Pawn: {event.theme?.pawn}</div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <Link
                      href={`events/${event.id}/edit`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`events/${event.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mt-1"
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="w-100 flex justify-end mt-1">
          <Link
            href="events/create"
            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-8 w-8" />
            Create event
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  return formattedDate;
}
