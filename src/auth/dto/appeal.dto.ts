import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AppealDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(20, { message: 'Please explain your appeal in at least 20 characters' })
  @MaxLength(2000)
  message!: string;
}
