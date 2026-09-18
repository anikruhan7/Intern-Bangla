import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** Either an email address or a phone number - AuthService figures out which. */
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
