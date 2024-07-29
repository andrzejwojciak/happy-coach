import { EventDetails } from "@/src/lib/models/EventDetails";
import {
  ArrowUturnLeftIcon,
  CalendarDaysIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import clsx from "clsx";
import CopyToClipboard from "@/src/components/shared/copy-to-clipboard";

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

function EventStatus(finished: boolean, endsAt: Date): string {
  return finished
    ? "Finished"
    : endsAt > new Date()
    ? "In progress"
    : "Unfinished";
}

function Separator(): JSX.Element {
  return <div className="my-4 border-b border-gray-300"></div>;
}

export default async function EventCard({
  eventDetails,
}: {
  eventDetails: EventDetails;
}) {
  return (
    <div>
      <div className="flex flex-row">
        <div className="grow">
          <div className="text-3xl mb-2 font-bold">
            {eventDetails.event.eventName}
          </div>
          <div className="flex flex-row">
            <CalendarDaysIcon className="w-5 mr-1" />
            {formatDate(eventDetails.event.createdAt)} -{" "}
            {formatDate(eventDetails.event.endsAt ?? new Date())}
          </div>
        </div>
        <div className="content-center">
          <div
            className={clsx("rounded-md py-1 px-2 text-white", {
              "bg-blue-500":
                !eventDetails.event.finished &&
                eventDetails.event.endsAt! > new Date(),
              "bg-red-500":
                !eventDetails.event.finished &&
                eventDetails.event.endsAt! < new Date(),
              "bg-green-700": eventDetails.event.finished,
            })}
          >
            {EventStatus(
              eventDetails.event.finished,
              eventDetails.event.endsAt!
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div>
          <div className="flex flex-row space-x-3">
            <div>
              <div className="font-medium mb-2">Points to score</div>
              <div className="font-bold text-2xl">
                {eventDetails.event.totalPointsToScore}
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Points per hour</div>
              <div className="font-bold text-2xl">
                {eventDetails.event.pointsForHour}
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Point per kilometer</div>
              <div className="font-bold text-2xl">
                {eventDetails.event.pointsForKilometer}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex flex-row space-x-3">
              <div>
                <div className="font-medium mb-2">Points scored</div>
                <div className="font-bold text-2xl">
                  {eventDetails.pointsCount}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Hours gained</div>
                <div className="font-bold text-2xl">
                  {eventDetails.hoursCount}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Kilometers gained</div>
                <div className="font-bold text-2xl">
                  {eventDetails.kilometersCount}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex flex-row space-x-12">
              <div>
                <div className="font-medium mb-2">Entires</div>
                <div className="font-bold text-2xl">
                  {eventDetails.entiresCount}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Participants</div>
                <div className="font-bold text-2xl">
                  {eventDetails.participants.length}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Progress</div>
                <div className="font-bold text-2xl">
                  {eventDetails.pointsCount > 0
                    ? (
                        (eventDetails.pointsCount /
                          eventDetails.event.totalPointsToScore) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex flex-row space-x-3">
              <div>
                <div className="font-medium mb-2">
                  {eventDetails.event.theme && (
                    <div className="">
                      Theme:
                      <p>Name: {eventDetails.event.theme.name}</p>
                      <p>Start: {eventDetails.event.theme.start}</p>
                      <p>Finish: {eventDetails.event.theme.finish}</p>
                      <p>Pawn: {eventDetails.event.theme.pawn}</p>
                    </div>
                  )}
                  {!eventDetails.event.theme && <>No theme</>}
                </div>
              </div>
            </div>
          </div>

          <Separator />
        </div>
        <div className="lg:flex-auto">
          <div>
            <div className="font-medium mb-2 text-xl flex">
              Participants
              <div className="ml-3 max-h-7">
                {eventDetails.participants.length > 0 && (
                  <CopyToClipboard
                    data={eventDetails.participants
                      .map(
                        (participant) =>
                          `${
                            participant.fullName
                          } - ${participant.pointsCount.toFixed(2)} points`
                      )
                      .join("\n")}
                  />
                )}
              </div>
            </div>
            <div className="overflow-y-auto max-h-60">
              {eventDetails.participants.map((participant) => {
                return (
                  <div
                    key={participant.id}
                    className="flex flex-row items-center"
                  >
                    <div className="flex">
                      <UserCircleIcon className="w-6 mr-3" />
                      <div>
                        <div className="">{participant.fullName}</div>
                        <div className="text-slate-400 text-sm">
                          {participant.pointsCount.toFixed(2)} Points
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {eventDetails.participants.length === 0 && <>No one attended</>}
            </div>
          </div>

          <Separator />

          <div>
            <div className="font-medium mb-2 text-xl">Top 5 Participants</div>
            <div className="overflow-y-auto max-h-60">
              {eventDetails.participants
                .sort((a, b) => b.pointsCount - a.pointsCount)
                .map((participant) => {
                  return (
                    <div
                      key={participant.id}
                      className="flex flex-row items-center"
                    >
                      <div className="flex">
                        <UserCircleIcon className="w-6 mr-3" />
                        <div>
                          <div className="">{participant.fullName}</div>
                          <div className="text-slate-400 text-sm">
                            {participant.pointsCount.toFixed(2)} Points
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {eventDetails.participants.length === 0 && <>No one attended</>}
            </div>
          </div>

          <Separator />

          <div>
            <div className="font-medium mb-2 text-xl">
              Top 5 Participants - distance
            </div>
            <div className="overflow-y-auto max-h-60">
              {eventDetails.participants
                .sort((a, b) => b.kilometersCount - a.kilometersCount)
                .map((participant) => {
                  return (
                    <div
                      key={participant.id}
                      className="flex flex-row items-center"
                    >
                      <div className="flex">
                        <UserCircleIcon className="w-6 mr-3" />
                        <div>
                          <div className="">{participant.fullName}</div>
                          <div className="text-slate-400 text-sm">
                            {participant.kilometersCount.toFixed(2)} Kilometers
                            gained
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {eventDetails.participants.length === 0 && <>No one attended</>}
            </div>
          </div>

          <Separator />

          <div>
            <div className="font-medium mb-2 text-xl">
              Top 5 Participants - time
            </div>
            <div className="overflow-y-auto max-h-60">
              {eventDetails.participants
                .sort((a, b) => b.hoursCount - a.hoursCount)
                .map((participant) => {
                  return (
                    <div
                      key={participant.id}
                      className="flex flex-row items-center"
                    >
                      <div className="flex">
                        <UserCircleIcon className="w-6 mr-3" />
                        <div>
                          <div className="">{participant.fullName}</div>
                          <div className="text-slate-400 text-sm">
                            {participant.hoursCount.toFixed(2)} Hours gained
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {eventDetails.participants.length === 0 && <>No one attended</>}
            </div>
          </div>

          <Separator />

          <div>
            <div className="font-medium mb-2 text-xl">
              Top 5 Participants - entires
            </div>
            <div className="overflow-y-auto max-h-60">
              {eventDetails.participants
                .sort((a, b) => b.entiresCount - a.entiresCount)
                .map((participant) => {
                  return (
                    <div
                      key={participant.id}
                      className="flex flex-row items-center"
                    >
                      <div className="flex">
                        <UserCircleIcon className="w-6 mr-3" />
                        <div>
                          <div className="">{participant.fullName}</div>
                          <div className="text-slate-400 text-sm">
                            {participant.entiresCount.toFixed(0)} Entires added
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {eventDetails.participants.length === 0 && <>No one attended</>}
            </div>
          </div>
        </div>
      </div>

      <Separator />

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
