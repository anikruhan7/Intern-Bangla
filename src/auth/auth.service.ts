import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../user/users.service';
import {
  UserRole,
  VerificationStatus,
  BanStatus,
} from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { ConfirmEmailChangeDto } from './dto/confirm-email-change.dto';

// Raw Gmail SMTP delivery from this host has been observed taking up to ~2
// minutes (likely outbound SMTP being slow/throttled on the free hosting
// tier) - 5 minutes gives real margin so the code doesn't expire before the
// email even arrives. Switching to an HTTP-based transactional email
// provider (e.g. Resend) would deliver in seconds and let this shrink back
// down safely.
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Bangladeshi accredited institutions use .ac.bd (official) or .edu.bd -
// e.g. student_id@du.ac.bd, someone@nu.ac.bd, someone@istt.edu.bd.
const BD_EDU_EMAIL_PATTERN = /\.(ac|edu)\.bd$/i;

function isBangladeshiEduEmail(email: string): boolean {
  const domain = email.split('@')[1] ?? '';
  return BD_EDU_EMAIL_PATTERN.test(domain);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    if (registerDto.phone) {
      const existingPhone = await this.usersService.findByPhone(
        registerDto.phone,
      );
      if (existingPhone) {
        throw new BadRequestException(
          'User with this phone number already exists',
        );
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const {
      password,
      accountType,
      companyName,
      industry,
      companyAddress,
      companyCity,
      ...userData
    } = registerDto;
    void password;

    // Public self-registration can only ever create STUDENT or HR
    // (company) accounts. Elevated ADMIN access is never grantable here -
    // it only comes from the one-time admin seed script or an existing
    // admin using the user management endpoints.
    if (accountType === 'COMPANY') {
      let company = await this.companyRepo.findOne({
        where: { name: companyName },
      });
      if (!company) {
        company = await this.companyRepo.save(
          this.companyRepo.create({
            name: companyName,
            industry,
            address: companyAddress,
            city: companyCity,
            country: 'Bangladesh',
          }),
        );
      }

      return await this.usersService.create({
        ...userData,
        role: UserRole.HR,
        company,
        passwordHash: hashedPassword,
      });
    }

    // Students with a recognized Bangladeshi institutional email
    // (.ac.bd / .edu.bd) are auto-verified. Everyone else stays UNVERIFIED
    // until an admin manually verifies them from submitted details.
    const verificationStatus = isBangladeshiEduEmail(registerDto.email)
      ? VerificationStatus.VERIFIED
      : VerificationStatus.UNVERIFIED;

    return await this.usersService.create({
      ...userData,
      role: UserRole.STUDENT,
      passwordHash: hashedPassword,
      verificationStatus,
    });
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.identifier.trim();
    const looksLikeEmail = identifier.includes('@');

    const user = looksLikeEmail
      ? await this.usersService.findByEmail(identifier)
      : await this.usersService.findByPhone(identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.banStatus === BanStatus.BANNED) {
      throw new ForbiddenException({
        message:
          'This account has been permanently banned. You may submit an appeal.',
        banStatus: user.banStatus,
        banReason: user.banReason,
        appealCount: user.appealCount,
      });
    }
    if (user.banStatus === BanStatus.APPEAL_PENDING) {
      throw new ForbiddenException({
        message:
          'This account is banned and your appeal is still under review.',
        banStatus: user.banStatus,
        banReason: user.banReason,
        appealCount: user.appealCount,
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        banStatus: user.banStatus,
        banReason: user.banStatus === BanStatus.WARNED ? user.banReason : null,
      },
      ...tokens,
    };
  }

  async submitAppeal(email: string, message: string) {
    const user = await this.usersService.findByEmail(email);

    // Same generic response regardless of whether the account exists or is
    // even banned, to avoid leaking account state to an unauthenticated caller.
    const generic = {
      message:
        'If a banned account exists for that email, your appeal has been submitted for review.',
    };

    if (!user || user.banStatus !== BanStatus.BANNED) {
      return generic;
    }

    if (user.appealCount >= 2) {
      throw new BadRequestException(
        'This account has already used its maximum of 2 appeals.',
      );
    }

    await this.usersService.recordAppeal(user.id, message);
    return generic;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const isCurrentValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.setPasswordHash(userId, newHash);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Explicitly tells the caller when the email isn't registered, by
    // product decision here - the usual generic "if an account exists..."
    // response (which avoids leaking whether an email is registered) was
    // deliberately traded away for a clearer error message.
    if (!user) {
      throw new BadRequestException(
        'This email is not registered with Intern Bangla.',
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.usersService.setResetToken(user.id, hashOtp(otp), expiresAt);

    // Never make the caller wait on the SMTP round-trip (it can take a long
    // time, or hang, depending on the network path) - fire it and respond
    // immediately. Errors are still logged.
    this.mailService
      .sendPasswordResetOtp(user.email, user.firstName || 'there', otp)
      .catch((error) =>
        console.error('Failed to send password reset email:', error),
      );

    return { message: `A verification code has been sent to ${user.email}.` };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (
      !user ||
      !user.resetPasswordTokenHash ||
      user.resetPasswordTokenHash !== hashOtp(dto.otp) ||
      !user.resetPasswordExpiresAt ||
      user.resetPasswordExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('That code is invalid or has expired');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.consumeResetToken(user.id, newHash);

    return { message: 'Password reset successfully. You can now log in.' };
  }

  async requestEmailChange(userId: number, dto: RequestEmailChangeDto) {
    const newEmail = dto.newEmail.trim().toLowerCase();
    const existing = await this.usersService.findByEmail(newEmail);
    if (existing && existing.id !== userId) {
      throw new BadRequestException('That email address is already in use');
    }

    const user = await this.usersService.findOne(userId);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.usersService.setPendingEmailOtp(
      userId,
      newEmail,
      hashOtp(otp),
      expiresAt,
    );

    this.mailService
      .sendEmailChangeOtp(newEmail, user.firstName || 'there', otp)
      .catch((error) =>
        console.error('Failed to send email change verification:', error),
      );

    return {
      message: `We sent a 6-digit code to ${newEmail}. Enter it to confirm the change.`,
    };
  }

  async confirmEmailChange(userId: number, dto: ConfirmEmailChangeDto) {
    const state = await this.usersService.getPendingEmailState(userId);

    if (
      !state ||
      !state.pendingEmail ||
      !state.pendingEmailTokenHash ||
      state.pendingEmailTokenHash !== hashOtp(dto.otp) ||
      !state.pendingEmailExpiresAt ||
      state.pendingEmailExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('That code is invalid or has expired');
    }

    await this.usersService.consumeEmailChange(userId, state.pendingEmail);

    return { message: 'Email address updated.', email: state.pendingEmail };
  }

  async logout(userId: number) {
    await this.usersService.update(userId, { hashedRefreshToken: null });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ) as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as JwtSignOptions['expiresIn'],
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { hashedRefreshToken: hash });
  }
}
