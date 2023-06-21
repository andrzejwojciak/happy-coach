import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Record } from './entities/Record.js';
import { Event } from './entities/Event.js';
import { PostgresConfig } from '../config.js';
import { EventRecords } from './entities/EventRecords.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: PostgresConfig.host,
  port: Number(PostgresConfig.port),
  username: PostgresConfig.username,
  password: PostgresConfig.password,
  database: PostgresConfig.database,
  entities: [Record, Event, EventRecords],
  synchronize: true,
  logging: false,
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
const startDatabase: Promise<void> = AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log('database up and running');
  })
  .catch((error) => console.log(error));

export { startDatabase, AppDataSource };
