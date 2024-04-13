"use server";

import { Event } from "@/src/lib/models/Event";
import { Theme } from "@/src/lib/models/Theme";
import { PaginationRequest } from "@/src/lib/types/PaginationRequest";
import {
  getEvents as getEventsServiceMethod,
  createEvent as createEventServiceMethod,
} from "@/src/lib/services/eventsService";
import { createTheme } from "@/src/lib/services/themeService";
import { Result } from "@/src/lib/types/Result";
import { slackApp } from "@/src/bot/bot";
import { getCurrentUser } from "./sessionActions";

export async function getEvents(
  pagination: PaginationRequest
): Promise<Event[]> {
  const events = await getEventsServiceMethod(pagination);
  return events;
}

// TODO: Add validation
export async function createEvent(
  event: Event,
  theme?: Theme
): Promise<Result> {
  if (theme) {
    theme = await createTheme(theme);
  }

  event.themeId = Number(theme?.id ?? event.themeId);
  const newEventId = await createEventServiceMethod(event);

  if (!newEventId) return { success: false };

  const currentUser = await getCurrentUser();

  await slackApp.client.chat.postMessage({
    channel: process.env.MAIN_CHANNEL ?? "",
    text: `Hey champs are you alright? I hope you are because I have some exciting news :point_up::skin-tone-2:, <@${currentUser?.id}> started a challenge!\n 
    What: ${event.eventName}\n
    Starts: Now\n
    Ends: ${event.endsAt}\n
    How many points you have to score: ${event.totalPointsToScore}\n
    You get ${event.pointsForKilometer} for 1km\n 
    You get ${event.pointsForHour} for 1h\n 
    Good luck! :muscle::skin-tone-2:`,
  });

  return newEventId
    ? { success: true }
    : { success: false, errorMessage: "Something went wrong!" };
}
