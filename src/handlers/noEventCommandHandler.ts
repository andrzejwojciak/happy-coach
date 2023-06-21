import { Message } from '../slack/types/message.js';
import { HandleResult } from '../slack/types/handleResult.js';
import { AbstractHandler } from './handler.js';
import { RecordService } from '../services/recordService.js';

export default class NoEventCommandHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    if (request.bot_id) return super.handle(request);

    switch (true) {
      case new RegExp(
        '\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?(h|km|min)',
        'm'
      ).test(request.text):
        return await this.addEntires(request);
      case new RegExp(/^stats (distance|time) [2-9][0-9]{3}$/).test(
        request.text
      ):
        return await this.checkActivityStatsByYear(request);
      case new RegExp(/^stats (distance|time)$/).test(request.text):
        return await this.checkActivityStats(request);
      case new RegExp(/^stats$/).test(request.text):
        return await this.checkStats(request);
      default:
        return super.handle(request);
    }
  }

  private async addEntires(request: Message): Promise<HandleResult | null> {
    const recordService = new RecordService();

    var result = await recordService.addRecords(
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
    const recordService = new RecordService();

    const year = request.text.match(/[2-9][0-9]{3}/);
    const activity = request.text.match(/(distance|time)/);

    const usersRecords = await recordService.getUsersRecordByYear(
      Number(year![0]),
      activity![0]
    );

    const replyMessage = usersRecords ? usersRecords : 'nothing here';

    return {
      text: replyMessage,
    };
  }

  private async checkStats(request: Message): Promise<HandleResult | null> {
    if (request.thread_ts) return null;
    const recordService = new RecordService();

    const activity = request.text.match(/(distance|time)/);

    const usersRecords = await recordService.getUsersRecord(activity![0]);
    const replyMessage = usersRecords ? usersRecords : 'nothing here';

    return {
      text: replyMessage,
    };
  }

  private async checkActivityStats(
    request: Message
  ): Promise<HandleResult | null> {
    if (request.thread_ts) return null;
    const recordService = new RecordService();
    const timeValues = await recordService.getCurrentValues('time');
    const distanceValue = await recordService.getCurrentValues('distance');

    return {
      text: `Time: ${timeValues}, distance: ${distanceValue}`,
    };
  }
}
