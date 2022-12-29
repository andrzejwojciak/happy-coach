import pkg from '@slack/bolt';
import { SlackBotConfig } from './config.js';
import * as recordService from './services/recordService.js';

const { App } = pkg;

const app = new App({
  token: SlackBotConfig.botToken,
  signingSecret: SlackBotConfig.signInSecret,
  socketMode: true,
  appToken: SlackBotConfig.appToken,
  port: 3000,
});

app.message(
  new RegExp('\\+[0-9][0-9]{0,2}(?:[.][0-9]{0,2})?(h|km|min)', 'm'),
  async ({ message, say }) => {
    const mess = message as Message;
    if (mess.bot_id) return;

    const responseMessage = await recordService.addRecords(
      JSON.stringify(message),
      mess.text,
      mess.user
    );

    await say({
      text: responseMessage,
      thread_ts: mess.thread_ts,
      reply_broadcast: mess.thread_ts != null,
    });
  }
);

app.message(
  new RegExp(/^stats (distance|time) [2-9][0-9]{3}$/),
  async ({ message, say }) => {
    const mess = message as Message;
    if (mess.thread_ts) return;
    const text = mess.text;
    const year = text.match(/[2-9][0-9]{3}/);
    const activity = text.match(/(distance|time)/);

    const usersRecords = await recordService.getUsersRecord(
      Number(year![0]),
      activity![0]
    );
    const replyMessage = usersRecords ? usersRecords : 'nothing here';

    await say(replyMessage);
  }
);

app.message(new RegExp(/^stats$/), async ({ message, say }) => {
  const mess = message as Message;
  if (mess.thread_ts) return;
  const timeValues = await recordService.getCurrentValues('time');
  const distanceValue = await recordService.getCurrentValues('distance');

  await say(`Time: ${timeValues}, distance: ${distanceValue}`);
});

app.message(new RegExp(/^help$/), async ({ message, say }) => {
  const mess = message as Message;
  if (mess.thread_ts) return;

  let commands = '• help - you have just used it\n';
  commands +=
    '• +{value}{h|km|min} - will add and calculate the values. Can be placed multiple times anywhere in the message, can also be used in threads (eg. +10km)\n';
  commands +=
    '• stats - will display the distance and time over all time, can be used in the main chat\n';
  commands +=
    '• stats (distance|time) {year} - will display the distance or time for a given year, can be used in the main chat (eg. stats distance 2022)\n';
  commands +=
    '• HappyCoach (-v|version) - will display version of the application, can be used in main chat.\n';
  commands +=
    '• HappyCoach changelog - will display changes to the application version, and can be used in the main chat.\n';

  say({
    text: commands,
  });
});

app.message(
  new RegExp(/^(happycoach|HappyCoach|Coach) (version|-v)$/),
  async ({ message, say }) => {
    const mess = message as Message;
    if (mess.thread_ts) return;

    const version = '*HappyCoach®* v1.0.2\n\nWith <3 from Legnica';
    say({ text: version });
  }
);

app.message(
  new RegExp(/^(happycoach|HappyCoach|Coach) changelog$/),
  async ({ message, say }) => {
    const mess = message as Message;
    if (mess.thread_ts) return;

    let changes: string;
    changes =
      '*v1.0.2 (29.12.2022)*: \n\n• Added commands: changelog, version, help \n';
    changes +=
      "\n*v1.0.1 (28.12.2022)*: \n\n• Added handling for unit 'm' in the add value command \n• Fixed NaN issue while adding value with ','. Handling for ',' removed \n• Added replies for threads ";
    say({ text: changes });
  }
);

app.message(
  new RegExp('\\+[0-9][0-9]{0,2}(?:[.][0-9]{0,2})?m(?!i)', 'm'),
  async ({ message, say }) => {
    const mess = message as Message;
    let metersValue = '';
    let minutesValue = '';
    const numbers = recordService.getNumbersFromMessage(mess.text, 'm');

    numbers.forEach((number) => {
      metersValue += `+${number / 1000}km `;
      minutesValue += `+${number}min `;
    });

    await say({
      text: "Sorry, I cannot handle the 'm' unit, please choose which one you would like to use instead",
      thread_ts: mess.ts,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: "Sorry, I cannot handle the 'm' unit, please choose which one you would like to use instead:",
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Meters',
              },
              value: metersValue,
              action_id: 'unsported_unit-meter',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Minutes',
              },
              value: minutesValue,
              action_id: 'unsported_unit-minute',
            },
          ],
        },
      ],
    });
  }
);

app.action(
  new RegExp(/^(unsported_unit-minute|unsported_unit-meter)$/),
  async ({ action, body, client, ack, say }) => {
    const message = (body as unknown as Body).message;
    const typedAction = action as Action;

    const response = await recordService.addRecords(
      JSON.stringify(message),
      typedAction.value,
      message.user
    );

    await ack();
    await say({
      text: response,
      thread_ts: message.thread_ts,
      reply_broadcast: message.thread_ts != null,
    });
  }
);

const startBot: Promise<void> = (async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();

declare type Action = {
  action_id: string;
  block_id: string;
  value: string;
  type: string;
  action_ts: string;
};

declare type Body = {
  message: Message;
};

declare type Message = {
  user: string;
  text: string;
  type: string;
  subtype: string;
  event_ts: string;
  ts: string;
  root: string;
  client_msg_id: string;
  channel: string;
  channel_type: string;
  thread_ts: string;
  bot_id: string;
};

export { startBot };
