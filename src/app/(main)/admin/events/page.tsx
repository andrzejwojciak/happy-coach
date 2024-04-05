"use client";

import { Event } from "@/src/lib/models/Event";
import { getEvents } from "@/src/lib/actions/eventsActions";
import { useEffect, useState } from "react";
import CreateEventForm from "@/src/components/admin/events/create-event";

export default function Events() {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    getEvents({ page: 0, perPage: 100 }).then((response) => {
      setEvents(response);
    });
  }, []);

  return (
    <div>
      <div>
        <table className="w-full table-auto">
          <thead className="border-b-2">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Starts at</th>
              <th>Ends at</th>
              <th>Points for h</th>
              <th>Points for km</th>
              <th>Points to score</th>
              <th>Finished</th>
              <th>Theme</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events !== undefined
              ? events.map((event) => {
                  return (
                    <tr key={event.id} className="border-b-2">
                      <td>{event.id}</td>
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
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      <div className="mt-20">
        <CreateEventForm />
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
