import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestEmailChangeDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'New email is required' })
  newEmail!: string;
}
