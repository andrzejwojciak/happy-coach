import { Message } from '../slack/types/message.js';
import { AbstractHandler } from './handler.js';
import { HandleResult } from '../slack/types/handleResult.js';

export default class BasicCommandsHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    console.log('BasicCommandsHandler executed');

    switch (true) {
      case new RegExp(/^help$/).test(request.text):
        return this.helpCommand(request);
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

  private helpCommand(request: Message): HandleResult | null {
    if (request.thread_ts) return null;

    let commands = '• help - displays available commands\n';
    commands +=
      '• +{value}{h|km|min} - adds and calculates the values. Can be placed multiple times anywhere in the message, can also be used in threads (eg. +10km)\n';
    commands +=
      '• stats - displays the distance and time over all time, can be used in the main chat\n';
    commands +=
      '• stats (distance|time) {year} - displays the distance or time for optional given year, can be used in the main chat (eg. stats distance, stats time 2022)\n';
    commands +=
      '• HappyCoach (-v|version) - displays version of the application, can be used in main chat.\n';
    commands +=
      '• HappyCoach changelog - displays changes to the application version, and can be used in the main chat.\n';

    return { text: commands };
  }

  private versionCommand(request: Message): HandleResult | null {
    if (request.thread_ts) return null;

    const version = '*HappyCoach®* v2.0.0\n\nWith <3';
    return { text: version };
  }

  private pongCommand(request: Message): HandleResult | null {
    return { text: 'pong', thread_ts: request.thread_ts };
  }
}
