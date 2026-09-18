import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Resume } from '../../resume/entities/resume.entity';
import { Company } from '../../company/entities/company.entity';
import { Application } from '../../application/entities/application.entity';

export enum UserRole {
  STUDENT = 'STUDENT',
  ALUMNI = 'ALUMNI',
  HR = 'HR',
  ADMIN = 'ADMIN',
}

export enum BanStatus {
  NONE = 'NONE',
  WARNED = 'WARNED',
  BANNED = 'BANNED',
  APPEAL_PENDING = 'APPEAL_PENDING',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordTokenHash: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpiresAt: Date | null;

  // An email change only takes effect once the link sent to the NEW address
  // is clicked - the account's real `email` column never changes until
  // then, so a typo'd or someone-else's address can't lock you out.
  @Column({ type: 'varchar', nullable: true })
  pendingEmail: string | null;

  @Column({ type: 'varchar', nullable: true })
  pendingEmailTokenHash: string | null;

  @Column({ type: 'timestamp', nullable: true })
  pendingEmailExpiresAt: Date | null;

  @Column({ type: 'enum', enum: BanStatus, default: BanStatus.NONE })
  banStatus: BanStatus;

  @Column({ type: 'varchar', nullable: true })
  banReason: string | null;

  @Column({ type: 'int', default: 0 })
  appealCount: number;

  @Column({ type: 'varchar', nullable: true })
  appealMessage: string | null;

  // Students: verified via an educational email domain, or manually by an
  // admin. HR accounts are verified through their Company's own status.
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.UNVERIFIED,
  })
  verificationStatus: VerificationStatus;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Resume, (resume) => resume.student)
  resumes: Resume[];

  @OneToMany(() => Application, (app) => app.student)
  applications: Application[];

  @OneToMany(() => Application, (app) => app.referredBy)
  referrals: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
