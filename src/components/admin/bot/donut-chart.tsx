"use client";

import { OverallActivitiesSummary } from "@/src/lib/types/OverallActivitiesSummary";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

export default function DonutChart({
  overallActivities,
}: {
  overallActivities: OverallActivitiesSummary[];
}) {
  let data;

  let overallTime = overallActivities.find((item) => item.activity === "time");
  let overallDistance = overallActivities.find(
    (item) => item.activity === "distance"
  );

  data = {
    datasets: [
      {
        data: [overallTime?.value, overallDistance?.value],
        backgroundColor: ["rgb(255, 158, 0)", "rgb(9, 92, 214)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <Doughnut data={data} />
    </>
  );
}
