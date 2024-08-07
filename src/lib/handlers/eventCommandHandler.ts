import moment from "moment";
import { AbstractHandler } from "@/src/lib/handlers/handler";
import { Message } from "@/src/lib/types/slack/message";
import { HandleResult } from "@/src/lib/types/slack/handleResult";
import { Event } from "@/src/lib/types/Event";
import { getOrCreateUserById } from "@/src/lib/services/usersService";
import {
  addRecordsAsync,
  GetEventAsync,
} from "@/src/lib/services/eventsService";

export default class EventCommandHandler extends AbstractHandler {
  private event!: Event;

  public async handle(request: Message): Promise<HandleResult | null> {
    const event = await GetEventAsync(request.channel);

    if (!event) {
      console.log("no event found for channel " + request.channel);
      return super.handle(request);
    } else {
      this.event = event;
    }

    switch (true) {
      case request.text === "event status":
        return this.getEventStatus();
      case new RegExp(
        "\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?(h|km|min)",
        "m"
      ).test(request.text):
        return await this.addEntiresToEvent(request);
      default:
        console.log("Command for event not found");
        return null;
    }
  }

  private async addEntiresToEvent(
    request: Message
  ): Promise<HandleResult | null> {
    const user = await getOrCreateUserById(request.user);

    const result = await addRecordsAsync(
      JSON.stringify(request),
      request.text,
      user.id,
      this.event
    );

    return {
      text: result,
      thread_ts: request.thread_ts,
      reply_broadcast: request.thread_ts != null,
    };
  }

  getEventStatus(): HandleResult {
    return {
      text: `Event ${this.event.eventName} started at ${moment(
        this.event.created_at
      ).format("DD-MMM-YYYY HH:mm:ss")} ends at ${moment(
        this.event.ends_at
      ).format("DD-MMM-YYYY HH:mm:ss")}. You have to score ${
        this.event.totalPointsToScore
      } points`,
    };
  }
}
