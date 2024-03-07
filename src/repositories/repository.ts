// TEMPORARY

import { MoreThan } from 'typeorm';
import { AppDataSource } from '../data/context.js';
import { Event } from '../data/entities/Event.js';
import { Record } from '../data/entities/Record.js';
import { EventRecords } from '../data/entities/EventRecords.js';
import { CreateEventDetails } from '../services/models/createEventModel.js';
import type ResultItem from '../services/models/resultItemModel.js';

const GetEventAsync = async (channelId: string): Promise<Event | null> => {
  const repository = AppDataSource.getRepository(Event);
  const today = new Date();
  return await repository.findOne({
    where: {
      channelId: channelId,
      ends_at: MoreThan(today),
      finished: false,
    },
  });
};

const SaveEvent = async (event: Event) => {
  const eventRepository = AppDataSource.getRepository(Event);
  await eventRepository.save(event);
};

const saveRecordAsync = async (
  userId: string,
  message: string,
  activity: string,
  values: number[],
  eventId: number
) => {
  const valuesSum = values.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  const record = new Record();
  record.userId = userId;
  record.activity = activity;
  record.value = Number(valuesSum.toFixed(2));

  await AppDataSource.manager.save(record);

  const eventRecords = new EventRecords();

  eventRecords.eventId = eventId;
  eventRecords.recordId = record.id;

  await AppDataSource.manager.save(eventRecords);
};

const SaveEventAsync = async (event: Event) => {
  await AppDataSource.manager.save(event);
};

const GetTotalScore = async (eventId: number) => {
  const recordRepository = AppDataSource.getRepository(Record);

  const query = `select SUM(value), activity
                   from record
                   where id in (select event_records."recordId"
                                from event_records
                                where event_records."eventId" = ${eventId})
                   group by activity`;

  const result = (await recordRepository.query(query)) as ResultItem[];

  return result;
};

// MOVED FROM RECORD SERVICE:

const getCurrentValues = async (activity: string): Promise<number> => {
  const repo = AppDataSource.getRepository(Record);

  const { totalValue } = await repo
    .createQueryBuilder('record')
    .select('SUM(record.value)', 'totalValue')
    .where(`record.activity = '${activity}'`)
    .getRawOne();

  return totalValue;
};

const getUsersRecordByYear = async (
  year: number,
  activity: string
): Promise<any[]> => {
  const repo = AppDataSource.getRepository(Record);
  const query = repo
    .createQueryBuilder('record')
    .select('record.userId')
    .addSelect('SUM(record.value)', 'totalValue')
    .andWhere(`record.activity = '${activity}'`)
    .andWhere(`date_part('year', created_at) = ${year}`)
    .groupBy('record.userId')
    .orderBy('"totalValue"', 'DESC');

  return await query.getRawMany();
};

const getUsersRecord = async (activity: string): Promise<any[]> => {
  const repo = AppDataSource.getRepository(Record);

  const query = repo
    .createQueryBuilder('record')
    .select('record.userId')
    .addSelect('SUM(record.value)', 'totalValue')
    .andWhere(`record.activity = '${activity}'`)
    .groupBy('record.userId')
    .orderBy('"totalValue"', 'DESC');

  return await query.getRawMany();
};

const saveRecord = async (record: Record) => {
  await AppDataSource.manager.save(record);
};

export default {
  GetEventAsync,
  saveRecordAsync,
  SaveEvent,
  SaveEventAsync,
  GetTotalScore,
  getCurrentValues,
  getUsersRecordByYear,
  getUsersRecord,
  saveRecord,
};
