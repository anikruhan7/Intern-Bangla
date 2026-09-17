import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EventMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventMode, default: EventMode.ONLINE })
  mode: EventMode;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'varchar', nullable: true })
  registrationUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
