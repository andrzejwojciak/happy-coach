import { Unit } from "@/src/lib/types/enums/Unit";

export type Activity = {
  id: number;
  userId: string;
  avatar: string;
  username: string;
  activity: string;
  unit: Unit;
  message: string;
  value: number;
  created_at: Date;
};
