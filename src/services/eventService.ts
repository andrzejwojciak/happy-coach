import { Event } from '../data/entities/Event.js';
import { Record } from '../data/entities/Record.js';
import { EventRecords } from '../data/entities/EventRecords.js';
import { AppDataSource } from '../data/context.js';
import { CreateEventDetails } from './models/createEventModel.js';
import { HandleResult } from '../slack/types/handleResult.js';
import { RecordService } from './recordService.js';

export class EventService {
  private currentSum: number = 0;

  public async addRecordsAsync(
    logMessage: string,
    message: string,
    userId: string,
    event: Event
  ): Promise<string> {
    const recordService = new RecordService();

    const distance = recordService.getNumbersFromMessage(message, 'km');
    const hours = recordService.getNumbersFromMessage(message, 'h');

    recordService
      .getNumbersFromMessage(message, 'min')
      .forEach((minute) => hours.push(minute / 60));

    let responseMessage: string = '';

    if (hours.length) {
      await this.saveRecordAsync(userId, logMessage, 'time', hours, event.id);
      responseMessage += this.prepareMessage(
        hours,
        'time',
        event.pointsForHour
      );
    }

    if (distance.length) {
      await this.saveRecordAsync(
        userId,
        logMessage,
        'distance',
        distance,
        event.id
      );
      responseMessage += this.prepareMessage(
        distance,
        'distance',
        event.pointsForKilometre
      );
    }

    let pointsScored: number = await this.getTotalScore(event);
    responseMessage += `\ntotal score:  ${this.currentSum + pointsScored}/${
      event.totalPointsToScore
    } points`;

    return responseMessage;
  }

  private async getTotalScore(event: Event): Promise<number> {
    const eventRecordRepository = AppDataSource.getRepository(EventRecords);
    const recordRepository = AppDataSource.getRepository(Record);

    const eventRecords = await eventRecordRepository
      .createQueryBuilder('event_records')
      .where('event_records.eventId = :id', { id: event.id })
      .select('event_records.recordId')
      .getRawMany();

    if (eventRecords.length === 0) return 0;

    const values = eventRecords.map((result) => Object.values(result)[0]);

    const query = await recordRepository
      .createQueryBuilder('record')
      .where('record.id IN (:...ids)', { ids: values })
      .select('record.value, record.activity')
      .getRawMany();

    let sumOfDistance = 0;
    let sumOfTime = 0;

    query.forEach((record) => {
      if (record.activity == 'time') sumOfTime += record.value;
      if (record.activity == 'distance') sumOfDistance += record.value;
    });

    return (
      sumOfDistance * event.pointsForKilometre + sumOfTime * event.pointsForHour
    );
  }

  private async saveRecordAsync(
    userId: string,
    message: string,
    activity: string,
    values: number[],
    eventId: number
  ) {
    const record = new Record();
    const valuesSum = values.reduce((accumulator, current) => {
      return accumulator + current;
    }, 0);

    record.message = message;
    record.userId = userId;
    record.activity = activity;
    record.value = Number(valuesSum.toFixed(2));

    await AppDataSource.manager.save(record);

    const eventRecords = new EventRecords();

    eventRecords.eventId = eventId;
    eventRecords.recordId = record.id;

    await AppDataSource.manager.save(eventRecords);
  }

  public async CreateEventAsync(
    createEventModel: CreateEventDetails
  ): Promise<HandleResult | null> {
    console.log('Creating event for channel id: ' + createEventModel.channelId);
    const event = new Event();

    event.channelId = createEventModel.channelId;
    event.created_at = new Date();
    event.ends_at = new Date(createEventModel.endsAt);
    event.eventName = createEventModel.name;
    event.pointsForHour = createEventModel.pointsForHour;
    event.pointsForKilometre = createEventModel.pointsForKilometre;
    event.totalPointsToScore = createEventModel.totalPointsToScore;

    console.log(event);
    await AppDataSource.manager.save(event);
    console.log('event saved, id: ' + event.id);

    return { text: 'event created' };
  }

  public async GetEventAsync(channelId: string): Promise<Event | null> {
    const repository = AppDataSource.getRepository(Event);
    const entity = await repository.findOne({
      where: { channelId: channelId },
    });
    return entity;
  }

  private prepareMessage(
    newRecords: number[],
    unit: string,
    pointsForUnit: number
  ): string {
    let message = '';

    if (newRecords.length === 1) {
      return (message += `you scored ${(newRecords[0] * pointsForUnit).toFixed(
        0
      )} points for ${unit}\n`);
    }

    let currentSum = 0;
    let isFirstNumber = true;

    newRecords.forEach((record) => {
      currentSum += record;
      if (isFirstNumber) {
        message += (record * pointsForUnit).toFixed(0);
        isFirstNumber = false;
      } else {
        message += ' + ' + (record * pointsForUnit).toFixed(0);
      }
    });

    this.currentSum += currentSum * pointsForUnit;
    message += ` = ${(currentSum * pointsForUnit).toFixed(
      0
    )} points for ${unit}\n`;

    return message;
  }
}
