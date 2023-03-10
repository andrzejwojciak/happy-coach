import { Record } from '../data/entities/Record.js';
import { AppDataSource } from '../data/context.js';

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

const addRecords = async (
  logMessage: string,
  message: string,
  userId: string
): Promise<string> => {
  const distance = getNumbersFromMessage(message, 'km');
  const hours = getNumbersFromMessage(message, 'h');
  getNumbersFromMessage(message, 'min').forEach((minute) =>
    hours.push(minute / 60)
  );

  let responseMessage: string = '';

  if (hours.length) {
    await saveRecord(userId, logMessage, 'time', hours);
    const sum = await getCurrentValues('time');
    responseMessage += prepareMessage(hours, sum, 'h');
  }

  if (distance.length) {
    await saveRecord(userId, logMessage, 'distance', distance);
    const sum = await getCurrentValues('distance');
    responseMessage += '\n' + prepareMessage(distance, sum, 'km');
  }

  return responseMessage;
};

const getNumbersFromMessage = (message: string, unit: string): number[] => {
  const regex = new RegExp(`\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?${unit}`, 'g');
  const matches = message.match(regex);

  let numbers: number[] = [];

  matches?.forEach((match) => {
    match = match.replace(',', '.');
    const foundNumber = match.match(/[0-9]\d{0,2}(?:[.][0-9]{0,2})?/);

    if (foundNumber) numbers.push(Number(foundNumber[0]));
  });

  return numbers;
};

const getCurrentValues = async (activity: string): Promise<number> => {
  const repo = AppDataSource.getRepository(Record);

  const sum = await repo
    .createQueryBuilder('record')
    .select('SUM(record.value)', 'totalValue')
    .where(`record.activity = '${activity}'`)
    .getRawOne();

  return sum.totalValue.toFixed(2);
};

const getUsersRecordByYear = async (
  year: number,
  activity: string
): Promise<string> => {
  let message: string = '';
  const repo = AppDataSource.getRepository(Record);
  const unit = activity === 'distance' ? 'km' : 'h';

  const query = repo
    .createQueryBuilder('record')
    .select('record.userId')
    .addSelect('SUM(record.value)', 'totalValue')
    .andWhere(`record.activity = '${activity}'`)
    .andWhere(`date_part('year', created_at) = ${year}`)
    .groupBy('record.userId')
    .orderBy('"totalValue"', 'DESC');

  const records = await query.getRawMany();

  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.totalValue;
  }, 0);

  message += `sum: ${sum.toFixed(2)}${unit}`;

  records.forEach(
    (record) =>
      (message += `\n<@${record.record_userId}> - ${record.totalValue.toFixed(
        2
      )}${unit}`)
  );

  return message;
};

const getUsersRecord = async (activity: string): Promise<string> => {
  let message: string = '';
  const repo = AppDataSource.getRepository(Record);
  const unit = activity === 'distance' ? 'km' : 'h';

  const query = repo
    .createQueryBuilder('record')
    .select('record.userId')
    .addSelect('SUM(record.value)', 'totalValue')
    .andWhere(`record.activity = '${activity}'`)
    .groupBy('record.userId')
    .orderBy('"totalValue"', 'DESC');

  const records = await query.getRawMany();

  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.totalValue;
  }, 0);

  message += `sum: ${sum.toFixed(2)}${unit}`;

  records.forEach(
    (record) =>
      (message += `\n<@${record.record_userId}> - ${record.totalValue.toFixed(
        2
      )}${unit}`)
  );

  return message;
};

const saveRecord = async (
  userId: string,
  message: string,
  activity: string,
  values: number[]
): Promise<void> => {
  console.log('saving data for user ' + userId);
  const record = new Record();
  const valuesSum = values.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  record.message = message;
  record.userId = userId;
  record.activity = activity;
  record.value = Number(valuesSum.toFixed(2));

  await AppDataSource.manager.save(record);
  console.log('user record saved, id: ' + record.id);
};

export {
  saveRecord,
  getCurrentValues,
  getNumbersFromMessage,
  getUsersRecord,
  getUsersRecordByYear,
  addRecords,
};
