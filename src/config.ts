import 'dotenv/config';

class SlackBotConfig {
  static botToken: string | undefined = process.env.SLACK_BOT_TOKEN;
  static signInSecret: string | undefined = process.env.SLACK_SIGNING_SECRET;
  static appToken: string | undefined = process.env.APP_TOKEN;
}

export { SlackBotConfig };
