import { Unit } from "@/src/lib/types/enums/Unit";

export type OverallActivitiesSummary = {
  activity: string;
  value: string;
  unit: Unit;
};

export type UserOverallActivitiesSummary = OverallActivitiesSummary & {
  userId: string;
};
