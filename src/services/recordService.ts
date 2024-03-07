import { Record } from '../data/entities/Record.js';
import Repository from '../repositories/repository.js';

export class RecordService {
  prepareMessage = (
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

  addRecords = async (
    logMessage: string,
    message: string,
    userId: string
  ): Promise<string> => {
    const distance = this.getNumbersFromMessage(message, 'km');
    const hours = this.getNumbersFromMessage(message, 'h');
    this.getNumbersFromMessage(message, 'min').forEach((minute) =>
      hours.push(minute / 60)
    );

    let responseMessage: string = '';

    if (hours.length) {
      await this.saveRecord(userId, logMessage, 'time', hours);
      const sum = await this.getCurrentValues('time');
      responseMessage += this.prepareMessage(hours, sum, 'h');
    }

    if (distance.length) {
      await this.saveRecord(userId, logMessage, 'distance', distance);
      const sum = await this.getCurrentValues('distance');
      responseMessage += '\n' + this.prepareMessage(distance, sum, 'km');
    }

    return responseMessage;
  };

  getNumbersFromMessage = (message: string, unit: string): number[] => {
    const regex = new RegExp(
      `\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?${unit}`,
      'g'
    );
    const matches = message.match(regex);

    let numbers: number[] = [];

    matches?.forEach((match) => {
      match = match.replace(',', '.');
      const foundNumber = match.match(/[0-9]\d{0,2}(?:[.][0-9]{0,2})?/);

      if (foundNumber) numbers.push(Number(foundNumber[0]));
    });

    return numbers;
  };

  getCurrentValues = async (activity: string): Promise<number> => {
    const totalValue = await Repository.getCurrentValues(activity);
    return Number(totalValue.toFixed(2));
  };

  getUsersRecordByYear = async (
    year: number,
    activity: string
  ): Promise<string> => {
    let message: string = '';

    const unit = activity === 'distance' ? 'km' : 'h';

    const records = await Repository.getUsersRecordByYear(year, activity);

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

  getUsersRecord = async (activity: string): Promise<string> => {
    let message: string = '';
    const unit = activity === 'distance' ? 'km' : 'h';

    const records = await Repository.getUsersRecord(activity);

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

  saveRecord = async (
    userId: string,
    message: string,
    activity: string,
    values: number[]
  ): Promise<void> => {
    const record = new Record();
    const valuesSum = values.reduce((accumulator, current) => {
      return accumulator + current;
    }, 0);

    record.userId = userId;
    record.activity = activity;
    record.value = Number(valuesSum.toFixed(2));

    await Repository.saveRecord(record);
  };
}
