"use server";

import { Event } from "@/src/lib/models/Event";
import { Theme } from "@/src/lib/models/Theme";
import { PaginationRequest } from "@/src/lib/types/PaginationRequest";
import {
  getEvents,
  createEvent,
  updateEvent,
  getEventByName,
  getEventById,
} from "@/src/lib/services/eventsService";
import { createTheme } from "@/src/lib/services/themeService";
import { Result } from "@/src/lib/types/Result";
import { slackApp } from "@/src/bot/bot";
import { getCurrentUser } from "./sessionActions";
import { redirect } from "next/navigation";

export async function getEventsAction(
  pagination: PaginationRequest
): Promise<Event[]> {
  const events = await getEvents(pagination);
  return events;
}

// TODO: Add validation for eventId
export async function getEventByIdAction(
  eventId: number
): Promise<Event | null> {
  if (typeof eventId !== "number") return null;
  const event = await getEventById(eventId);
  return event;
}

export async function createEventAction(
  event: Event,
  theme?: Theme
): Promise<Result> {
  var eventExists = await getEventByName(event.eventName);

  if (eventExists !== null) {
    return {
      success: false,
      errorMessage: "Event with this name already exists",
    };
  }

  if (theme) {
    theme = await createTheme(theme);
  }

  event.themeId = Number(theme?.id ?? event.themeId);
  const newEventId = await createEvent(event);

  if (!newEventId)
    return { success: false, errorMessage: "Something went wrong!" };

  const currentUser = await getCurrentUser();

  await slackApp.client.chat.postMessage({
    channel: process.env.MAIN_CHANNEL ?? "",
    text: `Hey champs are you good? I hope you are because I have some exciting news :point_up::skin-tone-2:, <@${currentUser?.id}> started a challenge!
    \nWhat: ${event.eventName}
    \nStarts: Now
    \nEnds: ${event.endsAt}
    \nHow many points you have to score: ${event.totalPointsToScore}
    \nYou get ${event.pointsForKilometer} for 1km
    \nYou get ${event.pointsForHour} for 1h
    \nGood luck! :muscle::skin-tone-2:`,
  });

  return newEventId
    ? redirect(`${newEventId}`)
    : { success: false, errorMessage: "Something went wrong!" };
}

export async function updateEventAction(
  event: Event,
  theme?: Theme
): Promise<Result> {
  const eventExists = await getEventById(event.id);

  if (eventExists === null) {
    return {
      success: false,
      errorMessage: "Event with this id does not exist",
    };
  }

  if (theme) {
    theme = await createTheme(theme);
  }

  event.themeId = Number(theme?.id ?? event.themeId);

  const updatedEvent = await updateEvent(event);

  if (!updatedEvent)
    return { success: false, errorMessage: "Something went wrong!" };

  return updatedEvent
    ? { success: true }
    : { success: false, errorMessage: "Something went wrong!" };
}
