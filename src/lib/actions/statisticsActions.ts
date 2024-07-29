"use server";

import { OverallActivitiesSummary } from "@/src/lib/types/OverallActivitiesSummary";
import { getOverallActivitiesSummary } from "@/src/lib/services/recordService";

export async function getOverallActivitiesSummaryAction(): Promise<
  OverallActivitiesSummary[]
> {
  return await getOverallActivitiesSummary();
}
