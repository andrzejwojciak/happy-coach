import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Record } from './entities/Record.js';
import { PostgresConfig } from '../config.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 32768,
  username: 'postgres',
  password: 'postgrespw',
  database: 'postgres2',
  entities: ['src/data/entities/**/*.ts"'],
  migrations: ['src/data/migrations/**/*.ts"'],
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
