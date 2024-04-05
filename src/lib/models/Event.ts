import { Theme } from "@/src/lib/models/Theme";

export type Event = {
  id: number;
  channelId: string;
  eventName: string;
  createdAt: Date;
  endsAt?: Date;
  pointsForKilometer: number;
  pointsForHour: number;
  totalPointsToScore: number;
  finished: boolean;
  themeId?: number;
  theme?: Theme;
};
