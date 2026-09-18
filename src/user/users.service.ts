import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  UserRole,
  BanStatus,
  VerificationStatus,
} from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(userData: Partial<User> & { password?: string }): Promise<User> {
    let passwordHash = userData.passwordHash;

    if (userData.password && !passwordHash) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(userData.password, salt);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userEntityData } = userData;

    const newUser = this.usersRepo.create({
      ...userEntityData,
      passwordHash,
    });

    const savedUser = await this.usersRepo.save(newUser);

    if (savedUser.email) {
      this.mailService
        .sendProfileCreationEmail(
          savedUser.email,
          savedUser.firstName || 'User',
        )
        .catch((error) =>
          console.error('Failed to send welcome email:', error),
        );
    }

    return this.sanitizeUser(savedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepo.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  /**
   * The authenticated user object from @GetUser() is loaded via findOne()
   * above, which does not join the company relation - so HR-owned-resource
   * checks (posting an internship, viewing applications) can't just read
   * user.company.id off it. This is a narrow, explicit lookup for exactly
   * that: which company (if any) this user belongs to.
   */
  async getCompanyIdForUser(userId: number): Promise<number | null> {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: { company: true },
      select: { id: true, company: { id: true } },
    });
    return user?.company?.id ?? null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { phone } });
  }

  /** Internal use only (e.g. verifying current password) - includes passwordHash. */
  async findByIdWithPassword(id: number): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async setPasswordHash(id: number, passwordHash: string): Promise<void> {
    await this.usersRepo.update(id, { passwordHash });
  }

  async setResetToken(
    id: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepo.update(id, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    });
  }

  async findByResetTokenHash(tokenHash: string): Promise<User | null> {
    return await this.usersRepo.findOne({
      where: { resetPasswordTokenHash: tokenHash },
    });
  }

  async setPendingEmailOtp(
    id: number,
    pendingEmail: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepo.update(id, {
      pendingEmail,
      pendingEmailTokenHash: tokenHash,
      pendingEmailExpiresAt: expiresAt,
    });
  }

  async getPendingEmailState(
    id: number,
  ): Promise<Pick<
    User,
    'pendingEmail' | 'pendingEmailTokenHash' | 'pendingEmailExpiresAt'
  > | null> {
    return await this.usersRepo.findOne({
      where: { id },
      select: {
        id: true,
        pendingEmail: true,
        pendingEmailTokenHash: true,
        pendingEmailExpiresAt: true,
      },
    });
  }

  async consumeEmailChange(id: number, newEmail: string): Promise<void> {
    await this.usersRepo.update(id, {
      email: newEmail,
      pendingEmail: null,
      pendingEmailTokenHash: null,
      pendingEmailExpiresAt: null,
    });
  }

  async consumeResetToken(id: number, passwordHash: string): Promise<void> {
    await this.usersRepo.update(id, {
      passwordHash,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
    });
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.findOne(id);

    if (updateData.email) {
      const existing = await this.findByEmail(updateData.email);
      if (existing && existing.id !== id) {
        throw new BadRequestException('That email address is already in use');
      }
    }

    if (updateData.phone) {
      const existing = await this.findByPhone(updateData.phone);
      if (existing && existing.id !== id) {
        throw new BadRequestException('That phone number is already in use');
      }
    }

    await this.usersRepo.update(id, updateData);
    const updatedUser = await this.findOne(id);

    const isTokenUpdateOnly =
      'hashedRefreshToken' in updateData &&
      Object.keys(updateData).length === 1;

    if (updatedUser.email && !isTokenUpdateOnly) {
      this.mailService
        .sendProfileUpdateEmail(
          updatedUser.email,
          updatedUser.firstName || 'User',
        )
        .catch((error) => console.error('Failed to send update email:', error));
    }

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepo.softDelete(id);
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    await this.findOne(id);
    await this.usersRepo.update(id, { role });
    return this.findOne(id);
  }

  async setVerificationStatus(
    id: number,
    verificationStatus: VerificationStatus,
  ): Promise<User> {
    await this.findOne(id);
    await this.usersRepo.update(id, { verificationStatus });
    return this.findOne(id);
  }

  async warn(id: number, reason: string): Promise<User> {
    await this.findOne(id);
    await this.usersRepo.update(id, {
      banStatus: BanStatus.WARNED,
      banReason: reason,
    });
    return this.findOne(id);
  }

  async ban(id: number, reason: string): Promise<User> {
    await this.findOne(id);
    await this.usersRepo.update(id, {
      banStatus: BanStatus.BANNED,
      banReason: reason,
      hashedRefreshToken: null,
    });
    return this.findOne(id);
  }

  async recordAppeal(id: number, message: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) return;
    await this.usersRepo.update(id, {
      banStatus: BanStatus.APPEAL_PENDING,
      appealMessage: message,
      appealCount: user.appealCount + 1,
    });
  }

  async resolveAppeal(id: number, approve: boolean): Promise<User> {
    await this.findOne(id);
    await this.usersRepo.update(id, {
      banStatus: approve ? BanStatus.NONE : BanStatus.BANNED,
      ...(approve ? { banReason: null } : {}),
    });
    return this.findOne(id);
  }

  async liftBan(id: number): Promise<User> {
    await this.findOne(id);
    await this.usersRepo.update(id, {
      banStatus: BanStatus.NONE,
      banReason: null,
    });
    return this.findOne(id);
  }

  private sanitizeUser(user: User): User {
    const safeUser = { ...user } as Partial<User>;
    delete safeUser.passwordHash;
    delete safeUser.hashedRefreshToken;
    // These are sha256 hashes of a 6-digit OTP - trivial to brute-force
    // offline if ever exposed, so they must never leave the server any more
    // than the password hash does.
    delete safeUser.resetPasswordTokenHash;
    delete safeUser.resetPasswordExpiresAt;
    delete safeUser.pendingEmailTokenHash;
    delete safeUser.pendingEmailExpiresAt;
    return safeUser as User;
  }
}
