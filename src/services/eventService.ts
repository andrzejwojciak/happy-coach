import { Event } from '../data/entities/Event.js';
import { Record } from '../data/entities/Record.js';
import { EventRecords } from '../data/entities/EventRecords.js';
import { AppDataSource } from '../data/context.js';
import { CreateEventDetails } from './models/createEventModel.js';
import { HandleResult } from '../slack/types/handleResult.js';
import { RecordService } from './recordService.js';
import { MoreThan, Not, Raw } from 'typeorm';
import { env, eventNames } from 'process';

export class EventService {
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

    const pointsScored: number = await this.getTotalScore(event);

    if (pointsScored >= event.totalPointsToScore)
      responseMessage = await this.finishEvent(event, pointsScored);
    else {
      switch (event.theme) {
        case 'dogs':
          const percentScored = Math.trunc(
            (pointsScored / event.totalPointsToScore) * 100
          );

          const dogEmoji = ':dog_2:';
          const loadingBar =
            '----------------------------------------------------------------------------------------------------';

          let progressBar =
            loadingBar.slice(0, percentScored - 1) +
            dogEmoji +
            loadingBar.slice(percentScored, loadingBar.length);

          responseMessage += `\n:dog-house:${progressBar}:bone: (${percentScored}%)`;
          responseMessage += `\n${pointsScored}/${event.totalPointsToScore} points`;
          break;
        default:
          responseMessage += `\ntotal score:  ${pointsScored}/${event.totalPointsToScore} points`;
      }
    }

    return responseMessage;
  }

  private async finishEvent(
    event: Event,
    pointsScored: Number
  ): Promise<string> {
    const eventRepository = AppDataSource.getRepository(Event);
    event.finished = true;
    eventRepository.save(event);

    return `Congratulations on completing the ${event.eventName} event! You scored ${pointsScored} points, finishing before the time ran out. Great job!`;
  }

  private async getTotalScore(event: Event): Promise<number> {
    const recordRepository = AppDataSource.getRepository(Record);

    const query = `select SUM(value), activity from record where id in (select event_records."recordId" from event_records where event_records."eventId" = ${event.id}) group by activity`;

    const result = (await recordRepository.query(query)) as ResultItem[];

    const distanceSum =
      result.find((row) => row.activity === 'distance')?.sum || 0;

    const timeSum = result.find((row) => row.activity === 'time')?.sum || 0;

    const totalPoints = (
      distanceSum * event.pointsForKilometre +
      timeSum * event.pointsForHour
    ).toFixed(0);

    return Number(totalPoints);
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
    event.theme = createEventModel.theme;
    event.pointsForHour = createEventModel.pointsForHour;
    event.pointsForKilometre = createEventModel.pointsForKilometre;
    event.totalPointsToScore = createEventModel.totalPointsToScore;

    console.log(event);
    await AppDataSource.manager.save(event);
    console.log('event saved, id: ' + event.id);

    return {
      text: `Event ${createEventModel.name} started! Good luck everyone! :crossed_fingers::skin-tone-2:`,
    };
  }

  public async GetEventAsync(channelId: string): Promise<Event | null> {
    const repository = AppDataSource.getRepository(Event);
    const today = new Date();
    const entity = await repository.findOne({
      where: {
        channelId: channelId,
        ends_at: MoreThan(today),
        finished: false,
      },
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

    message += ` = ${(currentSum * pointsForUnit).toFixed(
      0
    )} points for ${unit}\n`;

    return message;
  }
}

type ResultItem = {
  sum: number;
  activity: string;
};
