import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  createOrder(
    @Request() req: AuthenticatedRequest,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.createOrder(req.user.id, createPaymentDto);
  }

  @Get('mine')
  findMine(@Request() req: AuthenticatedRequest): Promise<Payment[]> {
    return this.paymentService.findMine(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment | null> {
    return this.paymentService.findOne(id);
  }
}
