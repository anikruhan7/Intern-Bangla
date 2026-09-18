import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TommyService } from './tommy.service';
import { AskTommyDto } from './dto/ask-tommy.dto';

@Controller('tommy')
export class TommyController {
  constructor(private readonly tommyService: TommyService) {}

  @Post('ask')
  // Tighter than the global default since this can call paid external APIs
  // (Gemini / Google Search) if the operator configures them.
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  ask(@Body() dto: AskTommyDto) {
    return this.tommyService.ask(dto.question, dto.history);
  }
}
