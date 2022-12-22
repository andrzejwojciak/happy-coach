import { Record } from '../data/entities/Record.js';
import { AppDataSource } from '../data/context.js';

const getNumbersFromMessage = (message: string, unit: string): number[] => {
  const regex = new RegExp(`\\+[0-9]\\d{0,2}(?:[.,]\\d+)?${unit}`, 'g');
  const matches = message.match(regex);

  let numbers: number[] = [];

  matches?.forEach((match) => {
    const foundNumber = match.match(/[0-9]\d{0,2}(?:[.,]\d+)?/);

    if (foundNumber) numbers.push(Number(foundNumber[0]));
  });

  return numbers;
};

const getCurrentValues = async (activity: string): Promise<number> => {
  const repo = AppDataSource.getRepository(Record);
  const records = await repo.findBy({ activity: activity });
  return records.reduce((accumulator: number, object: Record) => {
    return accumulator + object.value;
  }, 0);
};

const saveRecord = async (
  userId: string,
  message: string,
  activity: string,
  values: number[]
): Promise<void> => {
  console.log('saving data for user ' + userId);

  const record = new Record();

  record.message = message;
  record.userId = userId;
  record.activity = activity;
  record.value = values.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  await AppDataSource.manager.save(record);
  console.log('user record saved, id: ' + record.id);
};

export {
  saveRecord,
  getCurrentValues,
  getNumbersFromMessage as getSumFromMessage,
};
