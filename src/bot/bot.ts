import BasicCommandsHandler from "@/src/bot/handlers/basicCommandsHandler";
import EventCommandHandler from "@/src/bot/handlers/eventCommandHandler";
import NoEventCommandHandler from "@/src/bot/handlers/noEventCommandHandler";
import { Message } from "@/src/bot/types/message";
import { App } from "@slack/bolt";

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

const globalForStatus = globalThis as unknown as { status: string };

let status = globalForStatus.status || "Disabled";

if (process.env.NODE_ENV !== "production") globalForStatus.status = "Disabled";

const startBot = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
  status = "Enabled";
};

const stopBot = async () => {
  await app.stop();
  console.log("⚡️ Bolt app is stopping!");
  status = "Disabled";
};

const botStatus = (): string => {
  return status;
};

export { startBot, stopBot, botStatus };
