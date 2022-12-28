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

const prepareMessage = (
  newRecords: number[],
  currentSum: number,
  unit: string
): string => {
  const recordsSum = newRecords.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);
  const initial = currentSum - recordsSum;

  let message = `${initial.toFixed(2)}${unit}`;

  newRecords.forEach((record) => {
    message += ' + ' + record.toFixed(2) + unit;
  });

  message += ` = ${currentSum}${unit}`;

  return message;
};

app.message(
  new RegExp('\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?(h|km|min)', 'm'),
  async ({ message, say }) => {
    const mess = message as Message;
    const distance = recordService.getNumbersFromMessage(mess.text, 'km');
    const hours = recordService.getNumbersFromMessage(mess.text, 'h');
    recordService
      .getNumbersFromMessage(mess.text, 'min')
      .forEach((minute) => hours.push(minute / 60));
    const userId = mess.user;
    const serializedMessage = JSON.stringify(message);

    let responseMessage: string = '';

    if (hours.length) {
      await recordService.saveRecord(userId, serializedMessage, 'time', hours);
      const sum = await recordService.getCurrentValues('time');
      responseMessage += prepareMessage(hours, sum, 'h');
    }

    if (distance.length) {
      await recordService.saveRecord(
        userId,
        serializedMessage,
        'distance',
        distance
      );
      const sum = await recordService.getCurrentValues('distance');
      responseMessage += '\n' + prepareMessage(distance, sum, 'km');
    }

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
  const timeValues = await recordService.getCurrentValues('time');
  const distanceValue = await recordService.getCurrentValues('distance');

  await say(`Time: ${timeValues}, distance: ${distanceValue}`);
});

const startBot: Promise<void> = (async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();

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
};

export { startBot };
