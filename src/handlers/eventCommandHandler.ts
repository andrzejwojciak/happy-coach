import { Message } from '../slack/types/message.js';
import { AbstractHandler } from './handler.js';
import { HandleResult } from '../slack/types/handleResult.js';

export default class EventCommandHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    //TODO: Check if any event is assigned to channel
    //IF not super.handle(request)

    console.log('EventCommandHandler executed');

    switch (true) {
      case request.text === 'event1':
        return { text: 'event1 command called' };
      case request.text === 'event2':
        return { text: 'event2 command called' };
      default:
        //TODO: Return null if event is applied for channel and command didn't match to anything
        console.log('Passing request to the next handler');
        return super.handle(request);
    }
  }
}
