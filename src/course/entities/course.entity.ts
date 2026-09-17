import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseDomain } from '../../common/enums/course-domain.enum';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug: string;

  @Column({ type: 'enum', enum: CourseDomain })
  domain: CourseDomain;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'int', default: 6 })
  durationWeeks: number;

  @Column({ type: 'boolean', default: true })
  isFree: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'simple-json', nullable: true })
  curriculum: string[] | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
