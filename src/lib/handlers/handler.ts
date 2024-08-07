import { Message } from "@/src/lib/types/slack/message";
import { HandleResult } from "@/src/lib/types/slack/handleResult";

export interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: Message): Promise<HandleResult | null>;
}

export abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | undefined;

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
