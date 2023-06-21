import pkg from '@slack/bolt';
import { SlackBotConfig } from './config.js';
import { Message } from './slack/types/message.js';
import BasicCommandsHandler from './handlers/basicCommandsHandler.js';
import EventCommandHandler from './handlers/eventCommandHandler.js';
import NoEventCommandHandler from './handlers/noEventCommandHandler.js';

const { App } = pkg;

const basicCommandsHandler = new BasicCommandsHandler();
const eventCommandHandler = new EventCommandHandler();
const noEventCommandHandler = new NoEventCommandHandler();

basicCommandsHandler
  .setNext(eventCommandHandler)
  .setNext(noEventCommandHandler);

const app = new App({
  token: SlackBotConfig.botToken,
  signingSecret: SlackBotConfig.signInSecret,
  socketMode: true,
  appToken: SlackBotConfig.appToken,
  port: 3000,
});

app.message(new RegExp('.*'), async ({ message, say }) => {
  const mess = message as Message;
  console.log(mess);

  const handleResult = await basicCommandsHandler.handle(mess);
  if (!handleResult) return;

  await say({
    text: handleResult.text,
    thread_ts: handleResult.thread_ts,
    reply_broadcast: handleResult.reply_broadcast,
  });
});

const startBot: Promise<void> = (async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();

export { startBot };
