import {
  getCurrentUserOverallActivitiesSummary,
  getOverallActivitiesSummary,
} from "@/src/lib/services/recordsService";
import Chart from "@/src/components/home/chart";

export default async function OverallActivitySummary() {
  const overAllActivitySummary = await getOverallActivitiesSummary();
  const userOverAllActivitySummary =
    await getCurrentUserOverallActivitiesSummary();

  return (
    <>
      <div>
        <Chart
          overallActivities={overAllActivitySummary}
          userOverallActivities={userOverAllActivitySummary}
        ></Chart>
      </div>
      <div>
        Total input:
        {overAllActivitySummary.map((activitySummary) => {
          return (
            <div key={activitySummary.activity}>
              {activitySummary.activity}: {activitySummary.value}{" "}
              {activitySummary.unit}
            </div>
          );
        })}
      </div>
      {userOverAllActivitySummary === null ? null : (
        <>
          Your input: <br></br>
          {userOverAllActivitySummary.length === 0 ? (
            <>You do not have any records :( Add something</>
          ) : (
            <div>
              {userOverAllActivitySummary.map((activitySummary) => {
                return (
                  <div key={activitySummary.activity}>
                    {activitySummary.activity}: {activitySummary.value}{" "}
                    {activitySummary.unit}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
