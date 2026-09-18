import { IsString, MaxLength, MinLength } from 'class-validator';

export class ModerateUserDto {
  @IsString()
  @MinLength(5, { message: 'Please give a reason of at least 5 characters' })
  @MaxLength(500)
  reason!: string;
}
