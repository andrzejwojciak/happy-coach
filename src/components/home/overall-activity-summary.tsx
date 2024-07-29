import { getEvents } from "@/src/lib/services/eventsService";
import {
  getCurrentUserOverallActivitiesSummary,
  getOverallActivitiesSummary,
} from "@/src/lib/services/recordService";
import clsx from "clsx";

function EventStatus(finished: boolean, endsAt: Date): string {
  return finished
    ? "Finished"
    : endsAt > new Date()
    ? "In progress"
    : "Unfinished";
}

export default async function OverallActivitySummary() {
  const overAllActivitySummary = await getOverallActivitiesSummary();
  const userOverAllActivitySummary =
    await getCurrentUserOverallActivitiesSummary();
  const events = await getEvents({ page: 0, perPage: 10 });

  return (
    <div>
      <div className="flex justify-center text-xs mb-1">
        <div className="bg-slate-200 rounded-md text-black p-1 px-2">
          Achievements
        </div>
      </div>
      <div className="text-2xl text-center mb-2 font-sans">
        What we achieved
      </div>
      <div className="space-y-4">
        <div className="flex flex-col border-2 border-slate-200 rounded-lg p-4">
          <div className="flex flex-row justify-around space-x-5">
            {overAllActivitySummary.map((activitySummary) => {
              return (
                <div key={activitySummary.activity}>
                  <div>Total {activitySummary.activity}</div>
                  <div className="text-2xl font-medium">
                    {activitySummary.value} {activitySummary.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {userOverAllActivitySummary === null ? null : (
          <div className="flex flex-col border-2 border-slate-200 rounded-lg p-4">
            <div className="flex flex-row justify-around">
              {userOverAllActivitySummary.length === 0 ? (
                <>You do not have any records :( Add something</>
              ) : (
                <>
                  {userOverAllActivitySummary.map((activitySummary) => {
                    return (
                      <div key={activitySummary.activity}>
                        <div>Your {activitySummary.activity}</div>
                        <div className="text-2xl font-medium">
                          {activitySummary.value} {activitySummary.unit}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col border-2 border-slate-200 rounded-lg p-4">
          <div>
            <div className="text-center w-full">Challenges</div>
            <div className="flex flex-col">
              {events.map((event) => (
                <div
                  key={event.channelId}
                  className="flex flex-row justify-between space-y-4"
                >
                  <div>
                    <div>{event.eventName}</div>
                    <div className="text-slate-500 text-sm">
                      x/{event.totalPointsToScore} points scored
                    </div>
                  </div>
                  <div className="flex flex-row ml-16">
                    <div
                      className={clsx("rounded-md py-1 px-2 text-white", {
                        "bg-blue-500":
                          !event.finished && event.endsAt! > new Date(),
                        "bg-red-500":
                          !event.finished && event.endsAt! < new Date(),
                        "bg-green-700": event.finished,
                      })}
                    >
                      {EventStatus(event.finished, event.endsAt!)}
                    </div>
                    <div>
                      <button
                        disabled
                        className="cursor-not-allowed transition delay-150 hover:bg-yellow-400 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-2xl font-medium"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
