import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channelId: string;

  @Column()
  eventName: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  ends_at: Date;

  @Column()
  pointsForKilometre: number;

  @Column()
  pointsForHour: number;

  @Column()
  totalPointsToScore: number;
}
