import BasicCommandsHandler from "@/src/bot/handlers/basicCommandsHandler";
import EventCommandHandler from "@/src/bot/handlers/eventCommandHandler";
import NoEventCommandHandler from "@/src/bot/handlers/noEventCommandHandler";
import { Message } from "@/src/bot/types/message";
import { App } from "@slack/bolt";
import { getCache, saveCache } from "@/src/lib/cache/cacheService";

const basicCommandsHandler = new BasicCommandsHandler();
const eventCommandHandler = new EventCommandHandler();
const noEventCommandHandler = new NoEventCommandHandler();

basicCommandsHandler
  .setNext(eventCommandHandler)
  .setNext(noEventCommandHandler);

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  port: 3001,
});

slackApp.message(new RegExp(".*"), async ({ message, say }) => {
  const mess = message as Message;
  console.log(`User: ${mess.user} Message: ${mess.text}`);

  const handleResult = await basicCommandsHandler.handle(mess);
  if (!handleResult) return;

  await say({
    text: handleResult.text,
    thread_ts: handleResult.thread_ts,
    reply_broadcast: handleResult.reply_broadcast,
  });
});

const globalForApp = globalThis as unknown as { app: typeof slackApp };

const app = globalForApp.app || slackApp;

if (process.env.NODE_ENV !== "production") globalForApp.app = slackApp;

const startBot = async () => {
  if (getBotStatus() === "On") {
    return;
  }
  await app.start();

  setBotStatus("On");
  await app.client.chat.postMessage({
    channel: process.env.MAIN_CHANNEL ?? "",
    text: "Hey everyone! I'm back and eager to hear about your achievements today :muscle: I'm all ears!",
  });
};

const stopBot = async () => {
  if (getBotStatus() === "Off") {
    return;
  }
  await app.stop();

  setBotStatus("Off");
  await app.client.chat.postMessage({
    channel: process.env.MAIN_CHANNEL ?? "",
    text: "Someone shut me down. Don't post anything until I'm back :pray:",
  });
};

const getBotStatus = (): string => {
  let status = getCache("bot-status");

  if (!status) {
    status = { value: "Off" };
    saveCache("bot-status", status);
  }

  return status.value;
};

const setBotStatus = (value: string) => {
  saveCache("bot-status", { value: value });
};

export { startBot, stopBot, getBotStatus as botStatus };
