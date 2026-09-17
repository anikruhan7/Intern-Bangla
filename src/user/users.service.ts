import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
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

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.findOne(id);

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

  private sanitizeUser(user: User): User {
    const safeUser = { ...user } as Partial<User>;
    delete safeUser.passwordHash;
    delete safeUser.hashedRefreshToken;
    return safeUser as User;
  }
}
