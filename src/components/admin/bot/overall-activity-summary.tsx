import { getOverallActivitiesSummaryAction } from "@/src/lib/actions/statisticsActions";
import DonutChart from "@/src/components/admin/bot/donut-chart";
import { useEffect, useState } from "react";
import { OverallActivitiesSummary } from "@/src/lib/types/OverallActivitiesSummary";

export default function OverallActivitySummary() {
  const [overAllActivitySummary, setOverAllActivitySummary] = useState<
    OverallActivitiesSummary[]
  >([]);

  useEffect(() => {
    getOverallActivitiesSummaryAction().then((data) => {
      if (data) {
        setOverAllActivitySummary(data);
      }
    });
  });

  return (
    <>
      <div>
        <DonutChart overallActivities={overAllActivitySummary}></DonutChart>
      </div>
      <div className="mt-4 flex flex-row justify-between">
        {overAllActivitySummary.map((activitySummary) => {
          return (
            <div key={activitySummary.activity}>
              <div key={activitySummary.activity}>
                <div>{activitySummary.activity}</div>
                <div className="font-medium text-xl">
                  {`${Number(activitySummary.value).toFixed(2)} ${
                    activitySummary.unit
                  }`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
