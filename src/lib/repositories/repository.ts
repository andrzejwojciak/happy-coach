// TEMPORARY

import { ResultItem } from "@/src/bot/services/models/resultItemModel";
import { prismaClient } from "@/src/lib/data/client";

export const GetEventAsync = async (
  channelId: string,
): Promise<null | {
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
}> => {
  const today = new Date();

  const event = await prismaClient.event.findFirst({
    where: {
      channelId: channelId,
      ends_at: {
        gte: today,
      },
      finished: false,
    },
  });

  return event;
};

export const SaveEvent = async (event: {
  eventName: string;
  channelId: string;
  themeId: number | null;
  ends_at: Date;
  pointsForKilometre: number;
  pointsForHour: number;
  totalPointsToScore: number;
}) => {
  await prismaClient.event.create({
    data: event,
  });
};

export const SaveEventAsync = async (event: {
  channelId: string;
  created_at: Date;
  ends_at: Date;
  eventName: string;
  pointsForHour: number;
  pointsForKilometre: number;
  totalPointsToScore: number;
}) => {
  await prismaClient.event.create({
    data: event,
  });
};

export const saveRecordAsync = async (
  userId: string,
  message: string,
  activity: string,
  values: number[],
  eventId: number,
) => {
  const valuesSum = values.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  const record = {
    userId: userId,
    activity: activity,
    value: Number(valuesSum.toFixed(2)),
    message: message,
  };

  const createdRecord = await prismaClient.record.create({
    data: record,
  });

  const eventRecords = {
    eventId: eventId,
    recordId: createdRecord.id,
  };

  await prismaClient.event_records.create({
    data: eventRecords,
  });
};

export const GetTotalScore = async (eventId: number) => {
  const result = await prismaClient.$queryRaw<
    ResultItem[]
  >`select SUM(value), activity
      from record
      where id in (select event_records."recordId"
                   from event_records
                   where event_records."eventId" = ${eventId})
      group by activity`;

  return result;
};

// MOVED FROM RECORD SERVICE:

export const getCurrentValues = async (activity: string): Promise<number> => {
  const result = await prismaClient.record.aggregate({
    where: {
      activity: "distance",
    },
    _sum: {
      value: true,
    },
  });

  return result._sum.value || 0;
};

export const getUsersRecordByYear = async (
  year: number,
  activity: string,
): Promise<any[]> => {
  const result = await prismaClient.$queryRaw<any[]>`
        SELECT record."userId", SUM(record.value) AS "totalValue"
        FROM record
        WHERE record.activity = ${activity}
          AND date_part('year', created_at) = ${year}
        GROUP BY record."userId"
        ORDER BY "totalValue" DESC
    `;

  return result;
};

export const getUsersRecord = async (activity: string): Promise<any[]> => {
  const result = await prismaClient.$queryRaw<any[]>`
        SELECT record."userId", SUM(record.value) AS "totalValue"
        FROM record
        WHERE record.activity = ${activity}
        GROUP BY record."userId"
        ORDER BY "totalValue" DESC
    `;

  return result;
};

export const saveRecord = async (record: {
  userId: string;
  value: number;
  activity: string;
  message: string;
}) => {
  await prismaClient.record.create({
    data: record,
  });
};
