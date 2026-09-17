import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../course/entities/course.entity';

export enum CertificateType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
  BOTH = 'both',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40, unique: true })
  certificateNumber: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course: Course | null;

  @Column({
    type: 'enum',
    enum: CertificateType,
    default: CertificateType.DIGITAL,
  })
  type: CertificateType;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    nullable: true,
  })
  deliveryStatus: DeliveryStatus | null;

  @Column({ type: 'text', nullable: true })
  deliveryAddress: string | null;

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
