import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Coupon } from './entities/coupon.entity';
import { Course } from '../course/entities/course.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

/**
 * Stub payment flow: no real payment gateway is wired up yet. This
 * creates a PENDING order with a computed amount so the frontend checkout
 * UI has something real to call; a follow-up integration (Razorpay/SSLCommerz/etc.)
 * will replace `createOrder`'s fake providerOrderId with a real one and add a
 * webhook/verify endpoint that flips the status to SUCCESS.
 */
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async createOrder(userId: number, dto: CreatePaymentDto): Promise<Payment> {
    const course = await this.courseRepo.findOne({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    let amount = Number(course.price);
    let coupon: Coupon | null = null;

    if (dto.couponCode) {
      coupon = await this.couponRepo.findOne({
        where: { code: dto.couponCode },
      });
      if (
        !coupon ||
        !coupon.isActive ||
        (coupon.expiresAt && coupon.expiresAt < new Date())
      ) {
        throw new BadRequestException('Invalid coupon');
      }
      amount = amount - (amount * coupon.discountPercent) / 100;
    }

    const payment = this.paymentRepo.create({
      user: { id: userId },
      course,
      coupon,
      amount,
      status: amount === 0 ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
      providerOrderId: `stub_order_${randomUUID()}`,
    });

    return await this.paymentRepo.save(payment);
  }

  async findMine(userId: number): Promise<Payment[]> {
    return await this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: { course: true, coupon: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment | null> {
    return await this.paymentRepo.findOne({
      where: { id },
      relations: { course: true, coupon: true, user: true },
    });
  }
}
