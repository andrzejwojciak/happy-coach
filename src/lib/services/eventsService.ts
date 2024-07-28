import { prismaClient } from "@/src/lib/data/client";
import { PaginationRequest } from "@/src/lib//types/PaginationRequest";
import { unstable_noStore as noStore } from "next/cache";
import { Event } from "@/src/lib/models/Event";
import { EventDetails } from "../models/EventDetails";
import { Participant } from "../models/Participant";

export async function getEventByChannelId(
  channelId: string
): Promise<Event | null> {
  noStore();

  const event = await prismaClient.event.findFirst({
    where: {
      channelId: channelId,
      finished: false,
    },
    include: {
      theme: true,
    },
  });

  return event === null
    ? null
    : {
        id: event.id,
        channelId: event.channelId,
        eventName: event.eventName,
        createdAt: event.created_at,
        endsAt: event.ends_at,
        pointsForKilometer: event.pointsForKilometre,
        pointsForHour: event.pointsForHour,
        totalPointsToScore: event.totalPointsToScore,
        finished: event.finished,
        themeId: event.themeId ?? undefined,
        theme:
          event.themeId !== null && event.theme !== null
            ? {
                id: event.theme.id,
                name: event.theme.name,
                start: event.theme.start,
                finish: event.theme.finish,
                pawn: event.theme.pawn,
              }
            : undefined,
      };
}

export async function getEvents(
  pagination: PaginationRequest
): Promise<Event[]> {
  noStore();
  const results = await prismaClient.event.findMany({
    skip: pagination.page * pagination.perPage,
    take: pagination.perPage,
    include: {
      theme: true,
    },
  });

  return results.map((event) => {
    return {
      id: event.id,
      channelId: event.channelId,
      eventName: event.eventName,
      createdAt: event.created_at,
      endsAt: event.ends_at,
      pointsForKilometer: event.pointsForKilometre,
      pointsForHour: event.pointsForHour,
      totalPointsToScore: event.totalPointsToScore,
      finished: event.finished,
      themeId: event.themeId ?? undefined,
      theme:
        event.themeId !== null && event.theme !== null
          ? {
              id: event.theme.id,
              name: event.theme.name,
              start: event.theme.start,
              finish: event.theme.finish,
              pawn: event.theme.pawn,
            }
          : undefined,
    };
  });
}

export async function createEvent(event: Event): Promise<number> {
  const newEvent = await prismaClient.event.create({
    data: {
      eventName: event.eventName,
      ends_at: event.endsAt ?? new Date(),
      channelId: process.env.MAIN_CHANNEL ?? "", // TODO: Move to config file
      created_at: event.createdAt,
      finished: false,
      themeId: event.themeId,
      pointsForHour: event.pointsForHour,
      pointsForKilometre: event.pointsForKilometer,
      totalPointsToScore: event.totalPointsToScore,
    },
  });

  return newEvent.id;
}

export async function updateEvent(eventToUpdate: Event): Promise<boolean> {
  var event = await prismaClient.event.update({
    where: {
      id: eventToUpdate.id,
    },
    data: {
      eventName: eventToUpdate.eventName,
      ends_at: eventToUpdate.endsAt,
      pointsForHour: eventToUpdate.pointsForHour,
      pointsForKilometre: eventToUpdate.pointsForKilometer,
      finished: eventToUpdate.finished,
      totalPointsToScore: eventToUpdate.totalPointsToScore,
      themeId: eventToUpdate.themeId,
    },
  });

  return event !== null;
}

export async function finishEvent(eventId: number): Promise<void> {
  await prismaClient.event.update({
    where: {
      id: eventId,
    },
    data: {
      finished: true,
      finished_at: new Date(),
    },
  });

  return;
}

export async function getEventByName(name: string): Promise<Event | null> {
  noStore();

  const event = await prismaClient.event.findFirst({
    where: {
      eventName: name,
    },
    include: {
      theme: true,
    },
  });

  return event === null
    ? null
    : {
        id: event.id,
        channelId: event.channelId,
        eventName: event.eventName,
        createdAt: event.created_at,
        endsAt: event.ends_at,
        pointsForKilometer: event.pointsForKilometre,
        pointsForHour: event.pointsForHour,
        totalPointsToScore: event.totalPointsToScore,
        finished: event.finished,
        themeId: event.themeId ?? undefined,
        theme:
          event.themeId !== null && event.theme !== null
            ? {
                id: event.theme.id,
                name: event.theme.name,
                start: event.theme.start,
                finish: event.theme.finish,
                pawn: event.theme.pawn,
              }
            : undefined,
      };
}

export async function getEventById(id: number): Promise<Event | null> {
  noStore();

  const event = await prismaClient.event.findFirst({
    where: {
      id: id,
    },
    include: {
      theme: true,
    },
  });

  return event === null
    ? null
    : {
        id: event.id,
        channelId: event.channelId,
        eventName: event.eventName,
        createdAt: event.created_at,
        endsAt: event.ends_at,
        pointsForKilometer: event.pointsForKilometre,
        pointsForHour: event.pointsForHour,
        totalPointsToScore: event.totalPointsToScore,
        finished: event.finished,
        themeId: event.themeId ?? undefined,
        theme:
          event.themeId !== null && event.theme !== null
            ? {
                id: event.theme.id,
                name: event.theme.name,
                start: event.theme.start,
                finish: event.theme.finish,
                pawn: event.theme.pawn,
              }
            : undefined,
      };
}

export async function getEventDetailsById(
  id: number
): Promise<EventDetails | null> {
  noStore();
  const event = await getEventById(id);
  if (!event) return null;

  const participantsResults = await prismaClient.$queryRaw<any[]>`   
SELECT 
    "User".id,
    "User".email,
    "User".image_24,
    "User".display_name,
    SUM(CASE WHEN record.activity = 'time' THEN record."value" ELSE 0 END) AS time,
    SUM(CASE WHEN record.activity = 'distance' THEN record."value" ELSE 0 END) AS distance,
    COUNT(DISTINCT event_records.id) AS user_event_record_count,
    tc.total_records
FROM 
    event_records
JOIN 
    record ON event_records."recordId" = record.id
JOIN 
    "User" on record."userId" = "User".id
CROSS JOIN 
    (SELECT COUNT(*) AS total_records FROM event_records WHERE "eventId" = ${id}) tc
WHERE 
    event_records."eventId" = ${id}
GROUP BY 
    "User".id, "User".email, "User".image_24, "User".display_name, tc.total_records
ORDER BY 
    "User".id;`;

  let hoursCount = 0;
  let kilometersCount = 0;
  let participants: Participant[] = [];

  participantsResults.forEach((result) => {
    const participant = {
      id: result.id,
      avatarUrl: result.image_24,
      name: result.display_name,
      email: result.email,
      fullName: result.display_name,
      pointsCount:
        result.time * event.pointsForHour +
        result.distance * event.pointsForKilometer,
      kilometersCount: result.time,
      hoursCount: result.distance,
      entiresCount: Number(result.user_event_record_count),
    };
    participants.push(participant);

    hoursCount += result.time;
    kilometersCount += result.distance;
  });

  const pointsCount =
    hoursCount * event.pointsForHour +
    kilometersCount * event.pointsForKilometer;

  return {
    event: event,
    participants: participants,
    kilometersCount: kilometersCount,
    hoursCount: hoursCount,
    pointsCount: pointsCount,
    entiresCount:
      participantsResults.length > 0
        ? Number(participantsResults[0].total_records)
        : 0,
  };
}
