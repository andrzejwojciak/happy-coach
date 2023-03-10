import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  activity: string;

  @Column()
  message: string;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn()
  created_at: Date;
}
