import { Event } from '../data/entities/Event.js';
import { HandleResult } from '../slack/types/handleResult.js';
import { RecordService } from './recordService.js';
import { Unit } from '../enums/unit.js';
import Repository from '../repositories/repository.js';
import { CreateEventDetails } from './models/createEventModel.js';

export class EventService {
  private readonly recordService: RecordService;

  constructor() {
    this.recordService = new RecordService();
  }

  public async GetEventAsync(channelId: string): Promise<Event | null> {
    const event = Repository.GetEventAsync(channelId);
    return event;
  }

  public async SaveEventAsync(
    createEventModel: CreateEventDetails
  ): Promise<HandleResult | null> {
    const event = new Event();
    event.channelId = createEventModel.channelId;
    event.created_at = new Date();
    event.ends_at = new Date(createEventModel.endsAt);
    event.eventName = createEventModel.name;
    event.pointsForHour = createEventModel.pointsForHour;
    event.pointsForKilometre = createEventModel.pointsForKilometre;
    event.totalPointsToScore = createEventModel.totalPointsToScore;

    await Repository.SaveEventAsync(event);

    return {
      text: `Event ${createEventModel.name} started! Good luck everyone! :crossed_fingers::skin-tone-2:`,
    };
  }

  public async addRecordsAsync(
    logMessage: string,
    message: string,
    userId: string,
    event: Event
  ): Promise<string> {
    const distances = this.recordService.getNumbersFromMessage(
      message,
      Unit.Kilometer
    );
    const hours = this.recordService.getNumbersFromMessage(message, Unit.Hour);

    this.recordService
      .getNumbersFromMessage(message, Unit.Minute)
      .forEach((minute) => hours.push(minute / 60));

    let responseMessage: string = '';

    if (hours.length) {
      await Repository.saveRecordAsync(
        userId,
        logMessage,
        Unit.Time,
        hours,
        event.id
      );

      responseMessage += this.prepareMessage(
        hours,
        Unit.Time,
        event.pointsForHour
      );
    }

    if (distances.length) {
      await Repository.saveRecordAsync(
        userId,
        logMessage,
        Unit.Distance,
        distances,
        event.id
      );

      responseMessage += this.prepareMessage(
        distances,
        Unit.Distance,
        event.pointsForKilometre
      );
    }

    const pointsScored: number = await this.getTotalScore(event);

    if (pointsScored >= event.totalPointsToScore)
      responseMessage = await this.finishEvent(event, pointsScored);
    else {
      if (event.theme_id) {
        const percentScored = (pointsScored / event.totalPointsToScore) * 100;

        const start = ':dog-house:'; // TODO: get from event
        const finish = ':bone:'; // TODO: Get from event
        const dogEmoji = ':dog_2:'; // Todo: get from event
        const fieldChar = '–';
        const totalFieldsToJump = 20;

        let fieldsJumped = Math.trunc(
          (percentScored / 100) * totalFieldsToJump
        );
        let fieldsToJump = totalFieldsToJump - fieldsJumped - 1;

        let progressBar =
          fieldChar.repeat(fieldsJumped) +
          dogEmoji +
          fieldChar.repeat(fieldsToJump);

        responseMessage += `\n${start}${progressBar}${finish} (${percentScored.toFixed(
          2
        )}%)`;
        responseMessage += `\n${pointsScored}/${event.totalPointsToScore} points`;
      } else {
        responseMessage += `\ntotal score:  ${pointsScored}/${event.totalPointsToScore} points`;
      }
    }

    return responseMessage;
  }

  private async finishEvent(
    event: Event,
    pointsScored: Number
  ): Promise<string> {
    event.finished = true;
    await Repository.SaveEvent(event);

    return `Congratulations on completing the ${event.eventName} event! You scored ${pointsScored} points,
    finishing before the time ran out. Great job!`;
  }

  private async getTotalScore(event: Event): Promise<number> {
    const result = await Repository.GetTotalScore(event.id);

    const distanceSum =
      result.find((row) => row.activity === 'distance')?.sum || 0;

    const timeSum = result.find((row) => row.activity === 'time')?.sum || 0;

    const totalPoints = (
      distanceSum * event.pointsForKilometre +
      timeSum * event.pointsForHour
    ).toFixed(0);

    return Number(totalPoints);
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
