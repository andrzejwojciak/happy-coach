import { getOverallActivitiesSummary } from "@/src/lib/services/recordsService";

export default async function OverallActivitySummary() {
  const overAllActivitySummary = await getOverallActivitiesSummary();

  return (
    <>
      <div>
        WIP: chart here
        <div className="rounded-full w-48 h-48 bg-slate-400"></div>
      </div>
      <div>
        {overAllActivitySummary.map((activitySummary) => {
          return (
            <div key={activitySummary.activity}>
              {activitySummary.activity}: {activitySummary.value}{" "}
              {activitySummary.unit}
            </div>
          );
        })}
      </div>
    </>
  );
}
