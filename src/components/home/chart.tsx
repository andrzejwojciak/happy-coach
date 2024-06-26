"use client";

import {
  OverallActivitiesSummary,
  UserOverallActivitiesSummary,
} from "@/src/lib/types/OverallActivitiesSummary";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

export default function Chart({
  overallActivities,
  userOverallActivities,
}: {
  overallActivities: OverallActivitiesSummary[];
  userOverallActivities: UserOverallActivitiesSummary[] | null;
}) {
  let data;

  let overallTime = overallActivities.find((item) => item.activity === "time");
  let overallDistance = overallActivities.find(
    (item) => item.activity === "distance"
  );

  if (userOverallActivities) {
    const userOverallTime = userOverallActivities.find(
      (item) => item.activity === "time"
    );
    const userOverallDistance = userOverallActivities.find(
      (item) => item.activity === "distance"
    );

    const overallTimeValue =
      Number(overallTime?.value ?? 0) - Number(userOverallTime?.value ?? 0);

    const overallDistanceValue =
      Number(overallDistance?.value ?? 0) -
      Number(userOverallDistance?.value ?? 0);

    data = {
      labels: [
        "Total time",
        "Your time",
        "Total kilometers",
        "Your kilometers",
      ],
      datasets: [
        {
          data: [
            overallTimeValue,
            userOverallTime?.value,
            overallDistanceValue,
            userOverallDistance?.value,
          ],
          backgroundColor: [
            "rgb(102, 181, 255)",
            "rgb(128, 193, 255)",
            "rgb(255, 187, 153)",
            "rgb(255, 204, 179)",
          ],
          hoverOffset: 4,
        },
      ],
    };
  } else {
    data = {
      labels: ["Total time", "Total kilometers"],
      datasets: [
        {
          data: [overallTime?.value, overallDistance?.value],
          backgroundColor: ["rgb(102, 181, 255)", "rgb(255, 187, 153)"],
          hoverOffset: 4,
        },
      ],
    };
  }

  return (
    <>
      <Doughnut data={data} />
    </>
  );
}
