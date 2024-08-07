import { Message } from "@/src/lib/types/slack/message";
import { HandleResult } from "@/src/lib/types/slack/handleResult";
import { AbstractHandler } from "@/src/lib/handlers/handler";

export default class BasicCommandsHandler extends AbstractHandler {
  public async handle(request: Message): Promise<HandleResult | null> {
    switch (true) {
      case new RegExp(/^(happycoach|HappyCoach|Coach) (version|-v)$/).test(
        request.text
      ):
        return this.versionCommand(request);
      case request.text === "ping":
        return this.pongCommand(request);
      default:
        console.log("Passing request to the next handler");
        return super.handle(request);
    }
  }

  private versionCommand(request: Message): HandleResult | null {
    if (request.thread_ts) return null;

    const version = "*HappyCoach®* v3.0.0\n\nWith <3";
    return { text: version };
  }

  private pongCommand(request: Message): HandleResult | null {
    return { text: "pong!!!!!", thread_ts: request.thread_ts };
  }
}
