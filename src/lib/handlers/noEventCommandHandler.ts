import { AbstractHandler } from "@/src/lib/handlers/handler";
import { HandleResult } from "@/src/lib/types/slack/handleResult";
import { Message } from "@/src/lib/types/slack/message";
import { getOrCreateUserById } from "@/src/lib/services/usersService";
import {
  addRecords,
  getCurrentValues,
  getUsersRecord,
  getUsersRecordByYear,
} from "@/src/lib/services/recordService";

export default class NoEventCommandHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    if (request.bot_id) return super.handle(request);

    switch (true) {
      case new RegExp(
        "\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?(h|km|min)",
        "m"
      ).test(request.text):
        return await this.addEntires(request);
      case new RegExp(/^stats (distance|time) [2-9][0-9]{3}$/).test(
        request.text // Error
      ):
        return await this.checkActivityStatsByYear(request);
      case new RegExp(/^stats (distance|time)$/).test(request.text): // Works but shows stats for time and distance
        return await this.checkActivityStats(request);
      case new RegExp(/^stats$/).test(request.text): // Error
        return await this.checkStats(request);
      default:
        console.log("Passing request to the next handler");
        return super.handle(request);
    }
  }

  private async addEntires(request: Message): Promise<HandleResult | null> {
    await getOrCreateUserById(request.user);

    const result = await addRecords(
      JSON.stringify(request),
      request.text,
      request.user
    );

    return {
      text: result,
      thread_ts: request.thread_ts,
      reply_broadcast: request.thread_ts != null,
    };
  }

  private async checkActivityStatsByYear(
    request: Message
  ): Promise<HandleResult | null> {
    if (request.thread_ts) return null;

    const year = request.text.match(/[2-9][0-9]{3}/);
    const activity = request.text.match(/(distance|time)/);

    const usersRecords = await getUsersRecordByYear(
      Number(year![0]),
      activity![0]
    );

    const replyMessage = usersRecords ? usersRecords : "nothing here";

    return {
      text: replyMessage,
    };
  }

  private async checkActivityStats(
    request: Message
  ): Promise<HandleResult | null> {
    if (request.thread_ts) return null;

    const activity = request.text.match(/(distance|time)/);

    const usersRecords = await getUsersRecord(activity![0]);
    const replyMessage = usersRecords ? usersRecords : "nothing here";

    return {
      text: replyMessage,
    };
  }

  private async checkStats(request: Message): Promise<HandleResult | null> {
    if (request.thread_ts) return null;
    const timeValues = await getCurrentValues("time");
    const distanceValue = await getCurrentValues("distance");

    return {
      text: `Time: ${timeValues}, distance: ${distanceValue}`,
    };
  }
}
