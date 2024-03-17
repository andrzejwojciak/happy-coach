import { Unit } from "@/src/lib/types/enums/Unit";

export type Activity = {
  id: number;
  userId: string;
  ussername: string;
  activity: string;
  unit: Unit;
  message: string;
  value: number;
  created_at: Date;
};
