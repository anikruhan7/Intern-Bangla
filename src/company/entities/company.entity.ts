import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Internship } from '../../internship/entities/internship.entity';
import { User } from '../../user/entities/user.entity';

export enum CompanyVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  industry: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: CompanyVerificationStatus,
    default: CompanyVerificationStatus.PENDING,
  })
  verificationStatus: CompanyVerificationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  // Platform is Bangladesh-only for now - every company must be located here.
  @Column({ type: 'varchar', length: 50, default: 'Bangladesh' })
  country: string;

  // Path to an uploaded trade license / registration document (PDF or image).
  @Column({ type: 'varchar', nullable: true })
  identityDocumentUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason: string | null;

  @Column({ type: Boolean, default: false })
  banned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Internship, (internship) => internship.company)
  internships: Internship[];
}
