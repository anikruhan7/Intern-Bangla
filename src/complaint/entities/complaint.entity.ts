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
import { Company } from '../../company/entities/company.entity';

export enum ComplaintCategory {
  HARASSMENT = 'HARASSMENT',
  FRAUD_OR_SCAM = 'FRAUD_OR_SCAM',
  FAKE_LISTING = 'FAKE_LISTING',
  NO_SHOW = 'NO_SHOW',
  SPAM = 'SPAM',
  OTHER = 'OTHER',
}

export enum ComplaintStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  DISMISSED = 'DISMISSED',
}

export enum ComplaintAction {
  NONE = 'NONE',
  WARNING = 'WARNING',
  BAN = 'BAN',
}

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  // Exactly one of these two is set - who/what the complaint is against.
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reportedUserId' })
  reportedUser: User | null;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'reportedCompanyId' })
  reportedCompany: Company | null;

  @Column({ type: 'enum', enum: ComplaintCategory })
  category: ComplaintCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ComplaintStatus, default: ComplaintStatus.PENDING })
  status: ComplaintStatus;

  @Column({ type: 'enum', enum: ComplaintAction, default: ComplaintAction.NONE })
  adminAction: ComplaintAction;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
