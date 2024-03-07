import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startSymbol: string;

  @Column()
  finishSymbol: string;

  @Column()
  pawn: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  created_by: number;
}
