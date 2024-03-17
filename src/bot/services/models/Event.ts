export type Event = {
  id: number;
  channelId: string;
  themeId: number | null;
  eventName: string;
  created_at: Date;
  ends_at: Date;
  pointsForKilometre: number;
  pointsForHour: number;
  totalPointsToScore: number;
  finished: boolean;
};
