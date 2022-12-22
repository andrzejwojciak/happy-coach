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

const getName = (message: pkg.KnownEventFromType<'message'>) =>
  (message as { user: string }).user;

const getText = (message: pkg.KnownEventFromType<'message'>) =>
  (message as { text: string }).text;

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

  message += ` = ${currentSum.toFixed(2)}${unit}`;

  return message;
};

app.message(
  new RegExp('\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?(h|km)', 'm'),
  async ({ message, say }) => {
    console.log(message);
    const distance = recordService.getSumFromMessage(getText(message), 'km');
    const time = recordService.getSumFromMessage(getText(message), 'h');
    const userId = getName(message);
    const serializedMessage = JSON.stringify(message);

    let responseMessage: string = '';

    if (time.length) {
      await recordService.saveRecord(userId, serializedMessage, 'time', time);
      const sum = await recordService.getCurrentValues('time');
      responseMessage += prepareMessage(time, sum, 'h');
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

    await say(responseMessage);
  }
);

app.message('stats', async ({ message, say }) => {
  const timeValues = await recordService.getCurrentValues('time');
  const distanceValue = await recordService.getCurrentValues('distance');

  await say(`Time: ${timeValues}, distance: ${distanceValue}`);
});

const startBot: Promise<void> = (async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();

export { startBot };
