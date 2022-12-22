import 'dotenv/config';

class SlackBotConfig {
  static botToken: string | undefined = process.env.SLACK_BOT_TOKEN;
  static signInSecret: string | undefined = process.env.SLACK_SIGNING_SECRET;
  static appToken: string | undefined = process.env.APP_TOKEN;
}

class PostgresConfig {
  static host: string | undefined = process.env.DB_HOST;
  static port: string | undefined = process.env.DB_PORT;
  static username: string | undefined = process.env.DB_USERNAME;
  static password: string | undefined = process.env.DB_PASSWORD;
  static database: string | undefined = process.env.DB_DBNAME;
}

export { SlackBotConfig, PostgresConfig };
