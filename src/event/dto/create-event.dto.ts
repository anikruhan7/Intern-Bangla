import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EventMode } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(EventMode)
  mode?: EventMode;

  @IsDateString()
  startAt: string;

  @IsOptional()
  @IsUrl()
  registrationUrl?: string;
}
