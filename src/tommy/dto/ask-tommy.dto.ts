import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ChatTurnDto {
  @IsIn(['user', 'tommy'])
  role!: 'user' | 'tommy';

  @IsString()
  @MaxLength(2000)
  text!: string;
}

export class AskTommyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question!: string;

  // Prior turns in this conversation, oldest first - lets Tommy hold a real
  // multi-turn conversation instead of answering each message in isolation.
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatTurnDto)
  history?: ChatTurnDto[];
}
