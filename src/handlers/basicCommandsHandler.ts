import { SayArguments, SayFn } from '@slack/bolt';
import { Message } from '../slack/types/message.js';
import { AbstractHandler } from './handler.js';
import { HandleResult } from '../slack/types/handleResult.js';

export default class BasicCommandsHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    switch (true) {
      case new RegExp(/^help$/).test(request.text):
        this.helpCommand(request);
      case new RegExp(/^(happycoach|HappyCoach|Coach) (version|-v)$/).test(
        request.text
      ):
        this.versionCommand(request);
      case request.text === 'ping':
        this.pongCommand(request);
      default:
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

    const version = '*HappyCoach®* vX.X.X\n\nWith <3';
    return { text: version };
  }

  private pongCommand(request: Message): HandleResult | null {
    return { text: 'pong', thread_ts: request.thread_ts };
  }
}
