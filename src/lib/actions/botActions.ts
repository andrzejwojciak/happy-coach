"use server";

import { startBot, stopBot, botStatus } from "@/src/bot/bot";

export async function getBotStatusAction(): Promise<boolean> {
  return botStatus();
}

export async function changeBotStatusAction(): Promise<void> {
  const status = await getBotStatusAction();
  if (status) {
    await stopBot();
  } else {
    await startBot();
  }
}
