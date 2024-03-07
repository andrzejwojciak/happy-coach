import { Entity, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Setting {
  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  description: string;

  @Column({ default: false })
  is_active: boolean;
}
