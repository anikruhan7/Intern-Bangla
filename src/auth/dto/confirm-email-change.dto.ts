import { IsString, Matches } from 'class-validator';

export class ConfirmEmailChangeDto {
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Enter the 6-digit code we emailed you' })
  otp!: string;
}
