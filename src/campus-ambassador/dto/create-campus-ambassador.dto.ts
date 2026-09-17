import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCampusAmbassadorDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  university: string;

  @IsOptional()
  @IsString()
  motivation?: string;
}
