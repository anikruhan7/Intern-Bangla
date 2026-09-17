import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

// Note: there is deliberately no `role` field here. Public self-registration
// always creates a STUDENT account (see AuthService.register). Elevated
// roles (HR, ADMIN) can only be granted by an existing admin via the
// admin-only user management endpoints, or by the one-time admin seed script.
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}
