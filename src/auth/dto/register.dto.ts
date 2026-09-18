import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  Matches,
  ValidateIf,
} from 'class-validator';

export type PublicAccountType = 'STUDENT' | 'COMPANY';

// Note: `accountType` only ever selects between STUDENT and COMPANY (which
// maps to the HR role internally). There is deliberately no way to request
// ADMIN here - elevated admin access can only be granted via the one-time
// admin seed script or by an existing admin through the user management
// endpoints, never through public registration.
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

  @IsIn(['STUDENT', 'COMPANY'], {
    message: 'accountType must be STUDENT or COMPANY',
  })
  @IsOptional()
  accountType?: PublicAccountType;

  @ValidateIf((dto: RegisterDto) => dto.accountType === 'COMPANY')
  @IsString()
  @IsNotEmpty({ message: 'Company name is required for a company account' })
  @MaxLength(100)
  companyName?: string;

  @ValidateIf((dto: RegisterDto) => dto.accountType === 'COMPANY')
  @IsString()
  @IsNotEmpty({ message: 'Industry is required for a company account' })
  @MaxLength(50)
  industry?: string;

  @ValidateIf((dto: RegisterDto) => dto.accountType === 'COMPANY')
  @IsString()
  @IsNotEmpty({ message: 'Address is required for a company account' })
  @MaxLength(255)
  companyAddress?: string;

  @ValidateIf((dto: RegisterDto) => dto.accountType === 'COMPANY')
  @IsString()
  @IsNotEmpty({ message: 'City is required for a company account' })
  @MaxLength(100)
  companyCity?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}
