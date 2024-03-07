import { Message } from '../slack/types/message.js';
import { AbstractHandler } from './handler.js';
import { HandleResult } from '../slack/types/handleResult.js';

export default class BasicCommandsHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    console.log('BasicCommandsHandler executed');

    switch (true) {
      case new RegExp(/^(happycoach|HappyCoach|Coach) (version|-v)$/).test(
        request.text
      ):
        return this.versionCommand(request);
      case request.text === 'ping':
        return this.pongCommand(request);
      default:
        console.log('Passing request to the next handler');
        return super.handle(request);
    }
  }

  private versionCommand(request: Message): HandleResult | null {
    if (request.thread_ts) return null;

    const version = '*HappyCoach®* v2.1.0\n\nWith <3';
    return { text: version };
  }

  private pongCommand(request: Message): HandleResult | null {
    return { text: 'pong', thread_ts: request.thread_ts };
  }
}
