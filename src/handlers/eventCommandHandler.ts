import { Message } from '../slack/types/message.js';
import { AbstractHandler } from './handler.js';
import { HandleResult } from '../slack/types/handleResult.js';

export default class EventCommandHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    //TODO: Check if any event is assigned to channel
    //IF not super.handle(request)

    switch (true) {
      case request.text === 'event1':
        return { text: 'event1 command called' };
      case request.text === 'event2':
        return { text: 'event2 command called' };
      default:
        //TODO: Return null if event is applied for channel and commend didn't match to anything
        return super.handle(request);
    }
  }
}
