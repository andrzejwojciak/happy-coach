import {
  GetEventAsync,
  GetTotalScore,
  SaveEvent,
  SaveEventAsync,
  saveRecordAsync,
} from "@/src/lib/repositories/repository";
import { RecordService } from "@/src/bot/services/recordService";
import { CreateEventDetails } from "@/src/bot/services/models/createEventModel";
import { Event } from "@/src/bot/services/models/Event";
import { HandleResult } from "@/src/bot/types/handleResult";
import { Unit } from "@/src/bot/services/models/unit";
import { ResultItem } from "@/src/bot/services/models/resultItemModel";

export class EventService {
  private readonly recordService: RecordService;

  constructor() {
    this.recordService = new RecordService();
  }

  public async GetEventAsync(channelId: string): Promise<Event | null> {
    const event = await GetEventAsync(channelId);
    return event as Event;
  }

  public async SaveEventAsync(
    createEventModel: CreateEventDetails
  ): Promise<HandleResult | null> {
    const event = {
      channelId: createEventModel.channelId,
      created_at: new Date(),
      ends_at: new Date(createEventModel.endsAt),
      eventName: createEventModel.name,
      pointsForHour: createEventModel.pointsForHour,
      pointsForKilometre: createEventModel.pointsForKilometre,
      totalPointsToScore: createEventModel.totalPointsToScore,
    };

    await SaveEventAsync(event);

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

    let responseMessage: string = "";

    if (hours.length) {
      await saveRecordAsync(userId, logMessage, Unit.Time, hours, event.id);

      responseMessage += this.prepareMessage(
        hours,
        Unit.Time,
        event.pointsForHour
      );
    }

    if (distances.length) {
      await saveRecordAsync(
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
      if (event.themeId) {
        const percentScored = (pointsScored / event.totalPointsToScore) * 100;

        const fieldChar = "–";
        const totalFieldsToJump = 20;

        let fieldsJumped = Math.trunc(
          (percentScored / 100) * totalFieldsToJump
        );
        let fieldsToJump = totalFieldsToJump - fieldsJumped - 1;

        let progressBar =
          fieldChar.repeat(fieldsJumped) +
          event.theme?.pawn +
          fieldChar.repeat(fieldsToJump);

        responseMessage += `\n${event.theme?.startSign}${progressBar}${
          event.theme?.stopSign
        } (${percentScored.toFixed(2)}%)`;
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
    await SaveEvent(event);

    return `Congratulations on completing the ${event.eventName} event! You scored ${pointsScored} points,
    finishing before the time ran out. Great job!`;
  }

  private async getTotalScore(event: Event): Promise<number> {
    const result = await GetTotalScore(event.id);

    const distanceSum =
      result.find((row: ResultItem) => row.activity === "distance")?.sum || 0;

    const timeSum =
      result.find((row: ResultItem) => row.activity === "time")?.sum || 0;

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
    let message = "";

    if (newRecords.length === 1) {
      return (message += `you scored ${(newRecords[0] * pointsForUnit).toFixed(
        0
      )} points for ${unit}\n`);
    }

    let currentSum = 0;
    let isFirstNumber = true;

    newRecords.forEach((record: number) => {
      currentSum += record;
      if (isFirstNumber) {
        message += (record * pointsForUnit).toFixed(0);
        isFirstNumber = false;
      } else {
        message += " + " + (record * pointsForUnit).toFixed(0);
      }
    });

    message += ` = ${(currentSum * pointsForUnit).toFixed(
      0
    )} points for ${unit}\n`;

    return message;
  }
}
