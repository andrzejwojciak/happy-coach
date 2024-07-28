import { Event } from "@/src/lib/models/Event";
import { Participant } from "@/src/lib/models/Participant";

export type EventDetails = {
  event: Event;
  participants: Participant[];
  kilometersCount: number;
  hoursCount: number;
  entiresCount: number;
  pointsCount: number;
};
