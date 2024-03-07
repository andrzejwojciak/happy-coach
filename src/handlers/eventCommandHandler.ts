import { Message } from '../slack/types/message.js';
import { AbstractHandler } from './handler.js';
import { HandleResult } from '../slack/types/handleResult.js';
import { EventService } from '../services/eventService.js';
import { CreateEventDetails } from '../services/models/createEventModel.js';
import { Event } from '../data/entities/Event.js';
import moment from 'moment';

export default class EventCommandHandler extends AbstractHandler {
  private eventService: EventService;
  private event: Event;

  public async handle(request: Message): Promise<HandleResult | null> {
    console.log('EventCommandHandler executed');

    this.eventService = new EventService();
    const event = await this.eventService.GetEventAsync(request.channel);

    if (!event) {
      if (request.text.startsWith('create event'))
        return await this.createEventAsync(request);

      console.log('no event found for channel ' + request.channel);
      return super.handle(request);
    } else {
      this.event = event;
    }

    switch (true) {
      case request.text === 'event status':
        return this.getEventStatus();
      case new RegExp(
        '\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?(h|km|min)',
        'm'
      ).test(request.text):
        return await this.addEntiresToEvent(request);
      default:
        console.log('Command for event not found');
        return null;
    }
  }

  private async addEntiresToEvent(
    request: Message
  ): Promise<HandleResult | null> {
    const result = await this.eventService.addRecordsAsync(
      JSON.stringify(request),
      request.text,
      request.user,
      this.event
    );

    return {
      text: result,
      thread_ts: request.thread_ts,
      reply_broadcast: request.thread_ts != null,
    };
  }

  private async createEventAsync(
    request: Message
  ): Promise<HandleResult | null> {
    const eventDetails = this.createDictionary(request.text.split('\n'));
    const eventDetailsModel = this.assingToCreateEventModel(
      eventDetails,
      request.channel
    );
    return await this.eventService.SaveEventAsync(eventDetailsModel);
  }

  private createDictionary(list: string[]): Record<string, string> {
    const dictionary: Record<string, string> = {};

    for (const item of list) {
      const index = item.indexOf(':');

      if (index !== -1) {
        const key = item.substring(0, index).trim();
        const value = item.substring(index + 1).trim();
        dictionary[key] = value;
      }
    }

    return dictionary;
  }

  private assingToCreateEventModel(
    dictionary: Record<string, any>,
    channelId: string
  ): CreateEventDetails {
    return {
      starts: dictionary['starts'],
      endsAt: dictionary['ends at'],
      name: dictionary['name'],
      theme: dictionary['theme'],
      pointsForKilometre: dictionary['points for kilometre'],
      pointsForHour: dictionary['points for hour'],
      totalPointsToScore: dictionary['total points to score'],
      channelId: channelId,
    };
  }

  getEventStatus(): HandleResult {
    return {
      text: `Event ${this.event.eventName} started at ${moment(
        this.event.created_at
      ).format('DD-MMM-YYYY HH:mm:ss')} ends at ${moment(
        this.event.ends_at
      ).format('DD-MMM-YYYY HH:mm:ss')}. You have to score ${
        this.event.totalPointsToScore
      } points`,
    };
  }
}
