import pkg from '@slack/bolt';
import { SlackBotConfig } from './config.js';

const { App } = pkg;

const app = new App({
  token: SlackBotConfig.botToken,
  signingSecret: SlackBotConfig.signInSecret,
  socketMode: true,
  appToken: SlackBotConfig.appToken,
  port: 3000,
});

const getName = (message: pkg.KnownEventFromType<'message'>) =>
  (message as { user: string }).user;

app.message(
  new RegExp('[1-9][0-9]{0,2}(?:[.,][0-9]{1,3})?h$', 'm'),
  async ({ message, say }) => {
    console.log(message);
    await say(`<@${getName(message)}> typed something with hours, good job!`);
  }
);

app.message(
  new RegExp('\\+[1-9][0-9]{0,2}(?:[.,][0-9]{1,3})?km', 'm'),
  async ({ message, say }) => {
    console.log(message);
    await say(
      `<@${getName(message)}> typed something with kilometers, good job!`
    );
  }
);

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();
