import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  passowrd_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_set: boolean;

  @Column({ default: false })
  is_admin: boolean;
}
