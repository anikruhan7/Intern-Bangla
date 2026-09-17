import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { CouponService } from './coupon.service';
import { PaymentController } from './payment.controller';
import { CouponController } from './coupon.controller';
import { Payment } from './entities/payment.entity';
import { Coupon } from './entities/coupon.entity';
import { Course } from '../course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Coupon, Course])],
  controllers: [PaymentController, CouponController],
  providers: [PaymentService, CouponService],
  exports: [PaymentService, CouponService],
})
export class PaymentModule {}
