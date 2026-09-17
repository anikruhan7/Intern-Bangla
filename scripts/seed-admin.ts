/**
 * One-time bootstrap script to create the first project admin account.
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_FIRST_NAME / ADMIN_LAST_NAME
 * from .env. Run with: npm run seed:admin
 *
 * This is intentionally NOT an HTTP endpoint - admin accounts are never
 * creatable over the public API to prevent privilege escalation.
 */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/user/users.service';
import { UserRole } from '../src/user/entities/user.entity';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  const usersService = app.get(UsersService);

  const email = config.getOrThrow<string>('ADMIN_EMAIL');
  const password = config.getOrThrow<string>('ADMIN_PASSWORD');
  const firstName = config.get<string>('ADMIN_FIRST_NAME', 'Admin');
  const lastName = config.get<string>('ADMIN_LAST_NAME', 'User');

  const existing = await usersService.findByEmail(email);
  if (existing) {
    console.log(`Admin account for ${email} already exists (id=${existing.id}). Nothing to do.`);
    await app.close();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await usersService.create({
    firstName,
    lastName,
    email,
    passwordHash,
    role: UserRole.ADMIN,
  });

  console.log(`Created admin account: ${admin.email} (id=${admin.id}).`);
  console.log('You can now log in via POST /api/auth/login with this email and the ADMIN_PASSWORD you set in .env.');
  console.log('For real security, change ADMIN_PASSWORD after first login and rotate it out of .env.');

  await app.close();
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin account:', error);
  process.exit(1);
});
