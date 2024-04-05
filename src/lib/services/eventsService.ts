import { prismaClient } from "@/src/lib/data/client";
import { PaginationRequest } from "@/src/lib//types/PaginationRequest";
import { unstable_noStore as noStore } from "next/cache";
import { Event } from "@/src/lib/models/Event";

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

export async function createEvent(event: Event) {
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

  return newEvent;
}
