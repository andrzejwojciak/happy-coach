import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventRecords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column()
  recordId: number;
}
