"use server";

import { startBot, stopBot, botStatus } from "@/src/bot/bot";

export async function startBotAction(): Promise<void> {
  await startBot();
}

export async function stopBotAction(): Promise<void> {
  await stopBot();
}

export async function getBotStatusAction(): Promise<string> {
  return botStatus();
}
