import { Message } from '../slack/types/message.js';
import { HandleResult } from '../slack/types/handleResult.js';

export interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: Message): Promise<HandleResult | null>;
}

export abstract class AbstractHandler implements Handler {
  private nextHandler: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: Message): Promise<HandleResult | null> {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return Promise.resolve(null);
  }
}
